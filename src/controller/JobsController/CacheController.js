const middlwwarejson = require("../../../MedicalSolutions.json");

const middleware = async (req, res) => {
  // res.send({ middlwwarejson });
   const json = Object.keys(middlwwarejson).map(
    (item, index) => middlwwarejson[item]
  );
   res.send(json );
};

module.exports = {
  middleware,
};
