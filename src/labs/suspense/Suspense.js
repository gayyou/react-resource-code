export function Suspense(props) {
  return (<div>
    <Suspense fallback={<div>123 is loading</div>}>
      <div>123</div>
    </Suspense>
  </div>);
}
