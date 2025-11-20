const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");

exports.getSalesReport = async (req, res) => {
  //mydomain.com/api/report/salesReport?startDate=1/1/2025 & endDate=1/1/2026

  ///startDate=1/1/2025 & endDate=1/1/2026 this part is named Query
  //usually filtering is made by query
  ///but if we will use params it must be mydomain.com/startDate/endDate/category

  const { startDate, endDate } = req.query;
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.purchaseAt = {};
    matchStage.purchaseAt.$gte = new Date(startDate); //because it comes from query string
    matchStage.purchaseAt.$lte = new Date(endDate);

    const summary = await Purchase.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $addFields: {
          totalPrice: { $multiply: ["$price", "$quantity"] },
        },
      },
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                totalSalesAmount: { $sum: "$totalPrice" },
                totalQuantitySold: { $sum: "$quantity" },
                totalPurchases: { $sum: 1 },
              },
            },
          ],
          topProducts: [
            {
              $group: {
                _id: "$product._id",
                name: {$first:"$product.name"},
                revenue: { $sum: "$totalPrice" },
                quantitySold: { $sum: "$quantity" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
          ],
          topUsers: [
            {
              $group: {
                _id: "$user._id",
                name: { $first: "$user.name" },
                email: { $first: "$user.email" },
                totalSpent: { $sum: "$totalPrice" },
                totalQuantity: { $sum: "$quanitity" },
                totalPurchases: { $sum: 1 },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],
          montlySales: [
            {
              $group: {
                _id: {
                  year: { $year: "$purchaseAt" },
                  month: { $month: "$purchaseAt" },
                },
                totalRevenue: { $sum: "$totalPrice" },
                totalQuantity: { $sum: "$quantity" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": -1 } },
          ],
        },
      },
    ]);
    return res.status(200).json({message:`sales report from date ${startDate} to ${endDate}`,data:summary})
  }
      res.status(404).json({message:"error,start date or end date not found"})

};
