import products from "../products";
import { Row, Col } from "react-bootstrap";

const HomeScreen = () => {
  return (
    <div>
      <h1>Latest products</h1>
      <Row>
        {products.map((prod) => {
          <Col sm={12} md={6} lg={4} xl={3}>
            <h3>{prod.name}</h3>
          </Col>;
        })}
      </Row>
    </div>
  );
};

export default HomeScreen;
