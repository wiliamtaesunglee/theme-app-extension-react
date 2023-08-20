export default function App({ currentProduct }) {
  function formatBRL(number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
  }
  const productPrice = currentProduct.price / 100;
  const valueInStallments = formatBRL(productPrice / 3);
  const currentPrice = formatBRL(productPrice);
  const currentPriceWithDiscount = formatBRL((productPrice) * 0.95);
  return (
    <div className="tw-text-2xl">
      <p><span className="tw-line-through tw-pr-2">{currentPrice}</span><span className="tw-font-bold">{currentPriceWithDiscount}</span></p>
      <div className="tw-text-lg">
        <p >Valor somente em pix</p>
        <p>{`ou em 3x ${valueInStallments}`}</p>
      </div>
    </div>
  )
}

