export function isFilled(order) {
  return (
    order?.info?.orderStatus === "Filled" || order?.info?.state === "filled"
  );
}

export function isOpened(order) {
  return order?.info?.orderStatus === "New" || order?.info?.state === "new";
}
