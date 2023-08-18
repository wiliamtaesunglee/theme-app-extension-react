export default function App({ currentProduct }) {
  return (
    <div className="tw-text-5xl tw-text-red-600">
      {currentProduct.price * 0.95}
    </div>
  )
}

