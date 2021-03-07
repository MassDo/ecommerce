import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  if (keyword) {
    keyword = keyword.split("?keyword=")[1].split("&")[0];
  }

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((pg) => (
          <LinkContainer
            key={pg + 1}
            to={
              !isAdmin
                ? `/?keyword=${keyword}&page=${pg + 1}`
                : `/admin/productlist/?keyword=${keyword}&page=${pg + 1}`
            }
          >
            <Pagination.Item active={pg + 1 === page}>{pg + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
