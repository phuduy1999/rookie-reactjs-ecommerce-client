import React, { useCallback, useEffect, useRef, useState } from "react";
import category from "../assets/fake-data/category";
import productData from "../assets/fake-data/products";
import Button from "../components/Button";
import CheckBox from "../components/CheckBox";
import Helmet from "../components/Helmet";
import InfinityList from "../components/InfinityList";
import categoryApi from "../api/categoryApi";

const Catalog = () => {
  const initFilter = {
    category: [],
  };

  const productList = productData.getAllProducts();

  const [products, setProducts] = useState(productList);

  const [filter, setFilter] = useState(initFilter);

  const [categoriesParent, setCategoriesParent] = useState([]);

  const [listCategoriesSub, setListCategoriesSub] = useState([]);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      setFilter({
        ...filter,
        category: [...filter.category, item.id],
      });
    } else {
      const newCategory = filter.category.filter((e) => e !== item.id);
      setFilter({ ...filter, category: newCategory });
    }
  };

  const clearFilter = () => setFilter(initFilter);

  const updateProducts = useCallback(() => {
    let temp = productList;

    if (filter.category.length > 0) {
      temp = temp.filter((e) => filter.category.includes(e.id));
    }

    setProducts(temp);
  }, [filter, productList]);

  useEffect(() => {
    updateProducts();
  }, [updateProducts]);

  const filterRef = useRef(null);

  const showHideFilter = () => filterRef.current.classList.toggle("active");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await categoryApi.getParent();
        setCategoriesParent(response.data);
        const arr = [];
        response.data.forEach(async (parent) => {
          const res = await categoryApi.getSub(parent.id);
          arr.push(res.data);
        });
        setListCategoriesSub(arr);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(categoriesParent);
  console.log(listCategoriesSub);

  return (
    <Helmet title="Sản phẩm">
      <div className="catalog">
        <div className="catalog__filter" ref={filterRef}>
          <div
            className="catalog__filter__close"
            onClick={() => showHideFilter()}
          >
            <i className="bx bx-left-arrow-alt"></i>
          </div>
          <div className="catalog__filter__widget">
            <div className="catalog__filter__widget__title">
              danh mục sản phẩm
            </div>
            <div className="catalog__filter__widget__content">
              {categoriesParent.map((item, index) => (
                <div
                  key={index}
                  className="catalog__filter__widget__content__item"
                >
                  <span>{item.name}</span>
                  {listCategoriesSub[index] &&
                    listCategoriesSub[index].map((item) => {
                      console.log(item);
                      return (
                        <CheckBox
                          label={item.name}
                          onChange={(input) =>
                            filterSelect("CATEGORY", input.checked, item)
                          }
                          checked={filter.category.includes(item.id)}
                        />
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          <div className="catalog__filter__widget">
            <div className="catalog__filter__widget__content">
              <Button size="sm" onClick={clearFilter}>
                xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>
        <div className="catalog__filter__toggle">
          <Button size="sm" onClick={() => showHideFilter()}>
            bộ lọc
          </Button>
        </div>
        <div className="catalog__content">
          <InfinityList data={products} />
        </div>
      </div>
    </Helmet>
  );
};

export default Catalog;
