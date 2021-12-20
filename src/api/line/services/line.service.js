const mongoose = require("mongoose");

exports.lineWithProductsAggregation = (req) => {
  let query = req.query || {};

  if (query.organization)
    query.organization = mongoose.Types.ObjectId(query.organization);

  // Fields to be returned from query
  let group = {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      products: { $push: '$products' },
      createdAt: { $first: '$createdAt' }
    },
  };

  // Populates
  let lookups = [
    {
      $lookup:
        {
          from: "products",
          let: { lineId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$lineId', '$$lineId']
                }
              },
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ],
          as: "products",
        }
    },
    { $unwind: '$products' },
    {
      $lookup:
        {
          from: "countries",
          localField: "products.salesMarket",
          foreignField: "_id",
          as: "products.salesMarket",
        },
    }
  ];

  // Sort parameters
  let sort = { $sort: { createdAt: -1 } };

  // Final aggregation query
  let aggregation = [
    { $match: query },
    ...lookups,
    group,
    { $match: { products: { $ne: [] } } },
    sort
  ];

  return aggregation;
};
