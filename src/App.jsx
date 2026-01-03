import { useState } from 'react'
import React from 'react';
import './App.css'
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css'; 
const API_BASE = "https://ec-course-api.hexschool.io/v2"

// 請自行替換 API_PATH
const API_PATH = "sam60320";

function App() {
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [tempProduct, setTempProduct] = React.useState(null);

  const handleInputChange = (e) => {
    e.preventDefault();
    const {id,value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  //處理登入表單送出
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`,formData);
      const {token,expired} = response.data;

      //將token存在Cookie
      document.cookie = `hexToken=${token} ; expires=${new Date(expired)};`;
      
      //設定Axios 的預設Authorization Header (之後請求都會自動帶上)
      axios.defaults.headers.common['Authorization'] = token;
      
      alert("登入成功");
      setIsAuth(true);
      //取得產品列表
      getData();
    } catch (error) {
      alert("登入失敗: " + (error.response?.data?.message || "請檢查帳密"));
    }
  };

  const getData = async () => {
    try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
        setProducts(response.data.products);
    } catch (error) {
      console.log("取得產品失敗",error);
    }
  };



  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="images"
                          alt="副圖"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          {/* <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p> */}
        </div>
      )}
    </>
  );
}

export default App
