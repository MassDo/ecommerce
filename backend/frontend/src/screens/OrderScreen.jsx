import moment from "moment";
import { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { listMyOrders } from "../actions/orderActions";

const OrderScreen = ({ match }) => {
  // state
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  // Paypal script
  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AWgVqJgHr7qGohwDP_qbb3uxo7Ngt87APD_4xcIj2gXLsfYiZysBwJuC76mq5Ab1P-CnHOhF6W3nGa5Q";
    script.assync = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  // State modification
  useEffect(() => {
    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
      dispatch(listMyOrders());
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
    window.setTimeout(dispatch(listMyOrders()), 3000);
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? ( // do we have a loading status ?
    <Loader /> // yes so show the loader
  ) : error ? ( // ok no loading but do we have and error ?
    <Message variant="danger">{error}</Message> // yes so show the error message
  ) : (
    // no error and no loading so show me the orderscreen !!!!
    <div>
      <Link to="/admin/orderlists">Go Back</Link>
      <h1>Order: {order._id}</h1>
      <Row>
        {/* Order details  */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping: user and address */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  {" "}
                  Your order has been delivered on{" "}
                  {moment(order.deliveredAt).format("MMMM Do, YYYY")}
                </Message>
              ) : (
                <Message variant="warning">Not delivered</Message>
              )}
            </ListGroup.Item>
            {/* Payment method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment by: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  {" "}
                  Your order has been paid on{" "}
                  {moment(order.paidAt).format("MMMM Do, YYYY")}
                </Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>
            {/* Items */}
            <ListGroup.Item>
              <h2>Order items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">
                  Order is empty ! <Link to="/">Back To Products</Link>
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping */}
              <ListGroup.Item>
                <Row>
                  <Col>
                    Shipping: <p>(free above 100$)</p>
                  </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Taxes */}
              <ListGroup.Item>
                <Row>
                  <Col>
                    Tax: <p>(TVA 20%)</p>
                  </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* total */}
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Payment if it is not already done */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
