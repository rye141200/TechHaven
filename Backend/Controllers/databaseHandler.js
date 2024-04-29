const queryPro = (req, res, connection, sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};
exports.login = async (req, res, connection) => {
  const userData = req.body;
  const sql = `SELECT sakila.user_k.ID,sakila.user_k.First_Name,
                sakila.user_k.Last_Name,sakila.user_k.Email  
                FROM sakila.user_k , sakila.regular_user
                WHERE sakila.user_k.ID = sakila.regular_user.ID AND EMAIL= "${userData.email}" AND PASSWORD = "${userData.password}" 
  `;
  return await queryPro(req, res, connection, sql);
};
exports.getUser = async (req, res, connection, userID) => {
  const sql = `SELECT * FROM sakila.user_k, sakila.regular_user
                WHERE sakila.user_k .ID= "${userID}" AND sakila.regular_user.ID = "${userID}";
    `;
  return await queryPro(req, res, connection, sql);
};
exports.getProducts = async (req, res, connection, userID) => {
  const sql = `SELECT * FROM sakila.product
    WHERE sakila.product.Seller_ID="${userID}"
  `;
  return await queryPro(req, res, connection, sql);
};
exports.generateUUID = async (req, res, connection) => {
  const sql = "SELECT UUID()";
  return await queryPro(req, res, connection, sql);
};
exports.getAllProductsCount = async (req, res, connection) => {
  const sql = "SELECT COUNT(*) FROM sakila.product";
  return await queryPro(req, res, connection, sql);
};
exports.createNewProduct = async (
  req,
  res,
  connection,
  userID,
  productData,
  uuid
) => {
  const { Name, Description, Price, Image, Available_Quantity, Seller_ID } =
    productData;
  const sql = ` INSERT INTO sakila.product (Name, Description, Price, Image, Available_Quantity, Seller_ID,ID)
                VALUES  ("${Name}", "${Description}", ${Price} , "${Image}" , ${Available_Quantity} , "${Seller_ID}", "${uuid}"); `;
  return await queryPro(req, res, connection, sql);
};

exports.deleteFromDB = async (req, res, connection, uuid) => {
  const sql = `DELETE FROM sakila.product WHERE ID = "${uuid}"`;

  return await queryPro(req, res, connection, sql);
};

exports.updateDB = async (req, res, connection, productData, uuid) => {
  const { Name, Description, Price, Image, Available_Quantity } = productData;
  const sql = `UPDATE sakila.product SET Name = "${Name}" , Description = "${Description}" , Price = ${Price}, Image = CASE WHEN "${Image}" <> '' THEN "${Image}" ELSE Image END , Available_Quantity = ${Available_Quantity}
                WHERE ID = "${uuid}" `;

  return await queryPro(req, res, connection, sql);
};
exports.getAllProductsBoughtByUser = async (req, res, connection, userID) => {
  const sql = `SELECT *
  FROM sakila.order_k
  WHERE sakila.order_k.buyer_ID="${userID}"`;
  return await queryPro(req, res, connection, sql);
};
exports.getProductsInOrder = async (req, res, connection, orderID) => {
  const sql = `SELECT * FROM
  sakila.order_products, sakila.order_k,sakila.product
  WHERE sakila.order_products.Order_ID="${orderID}" AND sakila.order_k.ID=sakila.order_products.Order_ID AND sakila.product.ID=sakila.order_products.Product_ID
  ORDER BY sakila.order_k.Date DESC`;
  return await queryPro(req, res, connection, sql);
};

exports.getUserHistory = async (req, res, connection, userID) => {
  const sql = `
  SELECT 
  P.ID,
  P.Name,
  OP.Quantity,
  P.Price,
  P.Image,
  P.Seller_ID,
  O.Date
FROM 
  sakila.regular_user AS U,
  sakila.order_k AS O,
  sakila.order_products AS OP,
  sakila.product AS P
WHERE 
  U.ID = "${userID}" 
  AND O.ID = OP.Order_ID 
  AND OP.Product_ID = P.ID 
  AND U.ID = O.buyer_ID`;
  return await queryPro(req, res, connection, sql);
};
exports.getUserBalance = async (req, res, connection, userID) => {
  const sql = `SELECT sakila.regular_user.Balance
    FROM sakila.regular_user
    WHERE sakila.regular_user.ID="${userID}"`;
  return await queryPro(req, res, connection, sql);
};
exports.decrementBalance = async (req, res, connection, userID, newBalance) => {
  const sql = `UPDATE sakila.regular_user SET Balance=${newBalance}
  WHERE sakila.regular_user.ID = "${userID}"`;
  return await queryPro(req, res, connection, sql);
};
exports.decrementItemsCount = async (
  req,
  res,
  connection,
  proudctID,
  remainingQuantity
) => {
  const sql = `UPDATE sakila.product SET Available_Quantity=${remainingQuantity} WHERE sakila.product.ID = "${proudctID}";`;
  return await queryPro(req, res, connection, sql);
};
exports.storeOrderInOrdersTable = async (
  req,
  res,
  connection,
  userID,
  totalPrice,
  paymentType,
  orderID
) => {
  const sql = `INSERT INTO sakila.order_k  (ID, Payment_Type, Total_Price, buyer_ID) 
  VALUES ("${orderID}","${paymentType}",${totalPrice},"${userID}");`;
  return await queryPro(req, res, connection, sql);
};
exports.storeInOrderProductsTable = async (
  req,
  res,
  connection,
  orderID,
  productID,
  quantity
) => {
  const sql = `INSERT INTO sakila.order_products (Quantity,Order_ID,Product_ID)
  VALUES (${quantity},"${orderID}","${productID}")`;
  return await queryPro(req, res, connection, sql);
};
exports.makeDeposit = async (req, res, connection, user, newBalance) => {
  const sql = `
    UPDATE sakila.regular_user SET Balance = ${newBalance}
    WHERE sakila.regular_user.ID = "${user.ID}"
  `;
  await queryPro(req, res, connection, sql);
};
exports.storeInDepositTable = async (
  req,
  res,
  connection,
  userID,
  amount,
  depositID
) => {
  const sql = `INSERT INTO sakila.deposit (ID,Deposited_amount,RUser_SSN)
  VALUES("${depositID}",${amount},"${userID}")`;
  return await queryPro(req, res, connection, sql);
};

exports.searchByNameCount = async (req, res, connection, searchText) => {
  const sql = `
    SELECT COUNT(*) FROM sakila.product
    WHERE sakila.product.Name LIKE "%${searchText}%";
  `;
  return await queryPro(req, res, connection, sql);
};

exports.searchByName = async (
  req,
  res,
  connection,
  searchText,
  limit,
  offset
) => {
  const sql = `
    SELECT * FROM sakila.product
    WHERE sakila.product.Name LIKE "%${searchText}%" LIMIT ${limit} OFFSET ${offset};
  `;
  return await queryPro(req, res, connection, sql);
};
exports.checkIfBoughtProduct = async (req, res, connection, productID) => {
  const sql = `SELECT * FROM sakila.order_products
  WHERE sakila.order_products.Product_ID="${productID}"`;
  return await queryPro(req, res, connection, sql);
};
exports.deleteFromOrderProduct = async (req, res, connection, productID) => {
  const sql = `DELETE FROM sakila.order_products WHERE Product_ID = "${productID}"`;
  return await queryPro(req, res, connection, sql);
};
exports.searchByPrice = async (req, res, connection, price, limit, offset) => {
  const sql = `SELECT * FROM sakila.product WHERE
  sakila.product.Price <= ${price} LIMIT ${limit} OFFSET ${offset};`;
  return await queryPro(req, res, connection, sql);
};
exports.searchByPriceCount = async (req, res, connection, price) => {
  const sql = `SELECT COUNT(*) FROM sakila.product WHERE
  sakila.product.Price <= ${price};`;
  return await queryPro(req, res, connection, sql);
};
