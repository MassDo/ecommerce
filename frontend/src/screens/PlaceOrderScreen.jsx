import { useSate, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  // Attributs used in order summary
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = Number(cart.itemsPrice * 0.2).toFixed(2);
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const placeOrder = () => {
    console.log("order");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        {/* Order details  */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Address */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            {/* Payment method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment by: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            {/* Items */}
            <ListGroup.Item>
              <h2>Order items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">
                  You cart is empty ! <Link to="/">Back To Products</Link>
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        {/* image */}
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        {/* Name */}
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                        </Col>
                        {/* Total $  */}
                        <Col md={4}>
                          {item.price}$ x {item.qty} ={" "}
                          {(item.price * item.qty).toFixed(2)}$
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/* Order Resume with taxes */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              {/* Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Item: </Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping */}
              <ListGroup.Item>
                <Row>
                  <Col>
                    Shipping: <p>(free above 100$)</p>
                  </Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Taxes */}
              <ListGroup.Item>
                <Row>
                  <Col>
                    Tax: <p>(TVA 20%)</p>
                  </Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* total */}
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Button */}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disable={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Pay
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
