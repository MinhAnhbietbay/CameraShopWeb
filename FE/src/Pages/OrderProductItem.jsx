import React from "react";
import styles from "./MyOrder.module.css";

function OrderProductItem({
  image,
  productName,
  price,
  quantity,
  className,
  layout = "default",
}) {
  if (layout === "horizontal") {
    return (
      <div className={className}>
        <div className={styles.div12}>
          <div className={styles.column8}>
            <div className={styles.div13}>
              <img src={image} className={styles.img5} alt={productName} />
              <h4 className={styles.sonya7IiiMirrorless}>{productName}</h4>
            </div>
          </div>
          <div className={styles.column9}>
            <div className={styles.div14}>
              <span>{price}</span>
              <div className={styles.quantity}>
                <div className={styles.quantity3}>{quantity}</div>
              </div>
              <span>{price}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.div8}>
        <div className={styles.column3}>
          <div className={styles.div9}>
            <div className={styles.div10}>
              <div className={styles.column4}>
                <img src={image} className={styles.img4} alt={productName} />
              </div>
              <div className={styles.column5}>
                <h4 className={styles.canonEos90DBodyOnly}>
                  {productName.includes("(") ? (
                    <>
                      {productName.split("(")[0]}
                      <br />({productName.split("(")[1]}
                    </>
                  ) : (
                    productName
                  )}
                </h4>
              </div>
              <div className={styles.column6}>
                <span className={styles.css69999}>{price}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.column7}>
          <div className={styles.div11}>
            <div className={styles.quantity}>
              <div className={styles.quantity2}>{quantity}</div>
            </div>
            <span className={styles.css699992}>{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderProductItem;
