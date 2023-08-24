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
      <div className="tw-flex tw-items-center">
        <span className="tw-font-bold">{currentPriceWithDiscount}</span>
      </div>
      <div className="tw-text-lg">
        <p className="tw-font-bold">à vista no pix</p>
        <p>ou <span className="tw-font-bold">{currentPrice}</span> no cartão de crédito</p>
        <p>em até 3x de <span className="tw-font-bold">{valueInStallments}</span> sem juros</p>
      </div>
    </div>
  )
}

