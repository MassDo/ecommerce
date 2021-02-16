import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";

const ProductScreen = ({ match }) => {
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [match]);

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {/* Image */}
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>

          {/* Product Description */}
          <Col md={3}>
            <ListGroup variant="flush">
              {/* name */}
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              {/* rating */}
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                  color={"#f8e825"}
                />
              </ListGroup.Item>

              {/* Price */}
              <ListGroup.Item>Price: {product.price} $</ListGroup.Item>

              {/* Description */}
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup>
                {/* price */}
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>
                        <b>{product.price}$</b>
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Stock ? */}
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In stock" : "Not available"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/*  Add to Cart */}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    disabled={product.countInStock === 0}
                    type="button"
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProductScreen;
