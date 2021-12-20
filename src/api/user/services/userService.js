const Company = require("../../company-profile/model/companyProfile.model");
const CompanyRelation = require("../../company-relation/model/companyRelation.model");

exports.getUserRelatedCompaniesQuery = async (req) => {
  try {
    const companyId = req.user.company;
    const entity = await Company.findOne({ _id: companyId });
    const companyRelations = await CompanyRelation.find({
      $or: [{ companyA: req.user.company }, { companyB: req.user.company }],
    });
    const relatedCompaniesIds = companyRelations.map((cr) => {
      return cr.companyA.toString() !== req.user.company.toString()
        ? cr.companyA
        : cr.companyB;
    });

    const query = {
      $or: [
        { organization: entity.organization },
        { _id: relatedCompaniesIds },
      ],
    };

    return query;
  } catch (error) {
    console.log(error);
  }
};
