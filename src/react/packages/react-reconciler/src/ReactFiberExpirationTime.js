/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {ReactPriorityLevel} from './SchedulerWithReactIntegration';

import MAX_SIGNED_31_BIT_INT from './maxSigned31BitInt';

import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  IdlePriority,
} from './SchedulerWithReactIntegration';

export type ExpirationTime = number;

// 这些const就是优先级排序，数值越大的优先级越高

export const NoWork = 0;
// TODO: Think of a better name for Never. The key difference with Idle is that
// Never work can be committed in an inconsistent state without tearing the UI.
// The main example is offscreen content, like a hidden subtree. So one possible
// name is Offscreen. However, it also includes dehydrated Suspense boundaries,
// which are inconsistent in the sense that they haven't finished yet, but
// aren't visibly inconsistent because the server rendered HTML matches what the
// hydrated tree would look like.
export const Never = 1;
// Idle is slightly higher priority than Never. It must completely finish in
// order to be consistent.
export const Idle = 2;
export const Sync = MAX_SIGNED_31_BIT_INT;
// 批量处理
export const Batched = Sync - 1;

// 优先级单位大小
const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = Batched - 1;

/**
 * @desc 最后要进行逻辑或0的作用有两个
 * 1. 取整
 * 2. 去除溢出部分， JavaScript 32bit系统中最大的数字是 pow(2, 30) - 1，那么多出来的会进行溢出丢弃操作
 * @param ms
 * @returns {number}
 */
// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // 使用偏移量，防止产生0，与nowork相同
  // Always add an offset so that we don't clash with the magic number for NoWork.
  // TODO 这句话是正确的？
  //  MAGIC偏移数字设为31位最大的数字而不是32位的最大数字，是因为最后处理的结果必须
  //  在32位的最大数字范围内（31位的最大减去最小，范围肯定在32位以内）

  // 这个式子可以看做 - ((ms / 10 | 0) + MAGIC Number ，
  // 如果ms越大，那么前半部分就越小，处理的结果就越小，那么说明到期时间越小。而到期时间越小的话，优先级别就越高？？
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}

// 两者互换
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

/**
 * @desc 根据bucketSize大小进行分配bucket，计算以bucket为单位的时间并且向上取整
 * @param currentTime
 * @param expirationInMs
 * @param bucketSizeMs
 * @returns {number}
 */
function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    // ceil的作用是以第二个参数为单位进行向上取整
    ceiling(
      // 第一个参数全都是处理完毕的，以10ms为单位
      // 下面这个式子可以转为 MAGIC_NUMBER_OFFSET - (MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0)) + expirationInMs / UNIT_SIZE
      // 所以前面偏移量就可以减去了，TODO 设置偏移量的目的已经说明了，就是保证currentTime不要为0，为0代表着是nowork
      // 如果currentTime相同的话，到期时间bucket的选择取决于到期时间
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      // 如果bucketMs为250，那么的第二个参数就是25，所以是以25个UNIT_SIZE为单位进行处理，所以就是250ms一波
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

// MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE)

// Bucket 的目的是将一个区间的优先级别数字进行合并到一起，这样就会在一个一个区间进行执行任务

// TODO: This corresponds to Scheduler's NormalPriority, not LowPriority. Update
// the names to reflect.
// 低权限到期时间？
export const LOW_PRIORITY_EXPIRATION = 5000;
// 低权限批量时间大小
export const LOW_PRIORITY_BATCH_SIZE = 250;

/**
 * @desc 如果是普通异步代码的话，那么就是用
 * @param currentTime
 * @returns {ExpirationTime}
 */
export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE,
  );
}

/**
 *
 * @param currentTime
 * @param timeoutMs
 * @returns {ExpirationTime}
 */
export function computeSuspenseExpiration(
  // ms是处理后的时间
  currentTime: ExpirationTime,
  timeoutMs: number,
): ExpirationTime {
  // TODO: Should we warn if timeoutMs is lower than the normal pri expiration time?
  return computeExpirationBucket(
    currentTime,
    timeoutMs,
    LOW_PRIORITY_BATCH_SIZE,
  );
}

// We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
// batch size更小，也就是说细粒度越小，每个bucket容量更小，分多次，但是每次执行时间会减少
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}

/**
 * @desc 计算得出优先级
 * @param currentTime
 * @param expirationTime
 * @returns {ReactPriorityLevel}
 */
export function inferPriorityFromExpirationTime(
  currentTime: ExpirationTime,
  expirationTime: ExpirationTime,
): ReactPriorityLevel {
  // 按照优先级别进行排序
  if (expirationTime === Sync) {
    return ImmediatePriority;
  }
  if (expirationTime === Never || expirationTime === Idle) {
    return IdlePriority;
  }
  const msUntil =
    expirationTimeToMs(expirationTime) - expirationTimeToMs(currentTime);
  if (msUntil <= 0) {
    // 说明已经过期了，此时要直接执行
    return ImmediatePriority;
  }
  if (msUntil <= HIGH_PRIORITY_EXPIRATION + HIGH_PRIORITY_BATCH_SIZE) {
    return UserBlockingPriority;
  }
  if (msUntil <= LOW_PRIORITY_EXPIRATION + LOW_PRIORITY_BATCH_SIZE) {
    return NormalPriority;
  }

  // TODO: Handle LowPriority

  // Assume anything lower has idle priority
  return IdlePriority;
}
