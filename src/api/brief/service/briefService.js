const mongoose = require('mongoose');
const Brief = require('../model/brief.model');
const BriefMember = require('../../brief-member/model/briefMember.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const BriefSupplier = require('../../brief-supplier/model/briefSupplier.model');
const _ = require('lodash');

let isPublicMap = [];

function canEditCondition(briefMembers, brief, user) {
  return (
    briefMembers.find((bm) => bm.BriefId === brief._id)?.Admin ||
    user.role === 'admin' ||
    brief.CreatedBy?.toString() === user._id?.toString()
  );
}

exports.byOrganizationQuery = async (req) => {
  const userCompany = await CompanyProfile.findOne({ _id: req.user.company });
  const organizationCompanies = await CompanyProfile.find({
    organization: userCompany.organization,
  });
  const briefMembers = await BriefMember.find({
    UserId: mongoose.Types.ObjectId(req.user._id),
  });
  const briefMembersBriefsIds = briefMembers.map((bm) => bm.BriefId);
  const companiesIds = organizationCompanies.map((c) => c._id);

  const briefMembersOnly = {
    $and: [{ MembersOnly: true }, { _id: { $in: briefMembersBriefsIds } }],
  };

  const organizationBriefs = {
    $and: [{ ClientId: { $in: companiesIds } }, { MembersOnly: { $ne: true } }],
  };

  return { $or: [briefMembersOnly, organizationBriefs] };
};

exports.receivedBriefsQuery = async (req) => {
  const briefCompanies = await BriefSupplier.find({
    SupplierId: req.user.company,
  });
  const briefIds = briefCompanies.map((supplier) => supplier.BriefId);
  briefCompanies.forEach((supplier) => {
    isPublicMap[`${supplier.BriefId}`] = supplier.NdaAcceptance === 1 && !!supplier.SignedNda;
  });
  const query = {
    _id: { $in: briefIds },
  };

  return query;
};

exports.participatingBriefsQuery = async (req) => {
  const organizationId = req.query.organization;
  const organizationCompaniesIds = (await CompanyProfile.find({ organization: req.user.organization })).map(
    (c) => c._id
  );
  const participatingCompaniesIds = (await CompanyProfile.find({ organization: organizationId })).map((c) => c._id);
  const briefSupplierIds = (await BriefSupplier.find({ SupplierId: { $in: participatingCompaniesIds } })).map(
    (bs) => bs.BriefId
  );
  const briefMemberIds = (await BriefMember.find({ UserId: req.user._id, BriefId: { $in: briefSupplierIds } })).map(
    (bm) => bm.BriefId
  );
  const participatingBriefsQuery = {
    $or: [
      {
        $and: [
          { _id: { $in: briefSupplierIds } },
          { ClientId: { $in: organizationCompaniesIds } },
          { MembersOnly: { $ne: true } },
        ],
      },
      {
        $and: [{ _id: { $in: briefMemberIds } }, { MembersOnly: true }],
      },
    ],
    IsDraft: { $ne: true },
  };

  return participatingBriefsQuery;
};

exports.teamMemberBriefQuery = async (req) => {
  const briefMembers = await BriefMember.find({
    UserId: mongoose.Types.ObjectId(req.user._id),
  });
  const briefIds = briefMembers.map((supplier) => supplier.BriefId);
  const query = {
    $or: [{ _id: { $in: briefIds } }, { CreatedBy: req.user._id }],
  };

  return query;
};

exports.getFilterQuery = async (req) => {
  let filter = req.query || {};
  if (filter.Categories) {
    filter.Categories = { $in: filter.Categories };
  }

  if (filter.organization && req.user.role === 'admin') {
    let companiesIds = (await CompanyProfile.find({ organization: filter.organization })).map((c) => c._id);
    filter.ClientId = { $in: companiesIds };
  }

  if (filter.minPostingDate && filter.maxPostingDate) {
    const minDate = new Date(filter.minPostingDate);
    const maxDate = new Date(filter.maxPostingDate);
    maxDate.setHours(23, 59, 59);
    filter.createdAt = { $gte: minDate, $lte: maxDate };
    delete filter.minPostingDate;
    delete filter.maxPostingDate;
  } else if (filter.minPostingDate) {
    const minDate = new Date(filter.minPostingDate);
    filter.createdAt = { $gte: minDate };
    delete filter.minPostingDate;
    delete filter.maxPostingDate;
  } else if (filter.maxPostingDate) {
    const maxDate = new Date(filter.maxPostingDate);
    maxDate.setHours(23, 59, 59);
    filter.createdAt = { $lte: maxDate };
    delete filter.minPostingDate;
    delete filter.maxPostingDate;
  }
  if (filter.minBriefDeadline && filter.maxBriefDeadline) {
    const minDate = new Date(filter.minBriefDeadline);
    const maxDate = new Date(filter.maxBriefDeadline);
    maxDate.setHours(23, 59, 59);
    filter.Deadline = { $gte: minDate, $lte: maxDate };
    delete filter.minBriefDeadline;
    delete filter.maxBriefDeadline;
  } else if (filter.minBriefDeadline) {
    const minDate = new Date(filter.minBriefDeadline);
    filter.Deadline = { $lte: minDate };
    delete filter.minBriefDeadline;
    delete filter.maxBriefDeadline;
  } else if (filter.maxBriefDeadline) {
    const maxDate = new Date(filter.maxBriefDeadline);
    maxDate.setHours(23, 59, 59);
    filter.Deadline = { $lte: maxDate };
    delete filter.minBriefDeadline;
    delete filter.maxBriefDeadline;
  }

  let byOrganizationQuery;
  let receivedBriefsQuery;
  let participatingBriefsQuery;
  if (!!filter.sentOrReceived && filter.sentOrReceived === 'sent') {
    byOrganizationQuery = await this.byOrganizationQuery(req);
    filter = { ...filter, ...byOrganizationQuery };
  } else if (!!filter.sentOrReceived && filter.sentOrReceived === 'received') {
    receivedBriefsQuery = await this.receivedBriefsQuery(req);
    filter = { ...filter, ...receivedBriefsQuery };
  } else if (!!filter.sentOrReceived && filter.sentOrReceived === 'participating') {
    participatingBriefsQuery = await this.participatingBriefsQuery(req);
  }
  if (!!filter.mineOrTeamMember && filter.mineOrTeamMember === 'mine') {
    const myBriefsQuery = { CreatedBy: req.user._id };
    filter = { ...filter, ...myBriefsQuery };
  } else if (!!filter.mineOrTeamMember && filter.mineOrTeamMember === 'team-member') {
    const teamMemberBriefQuery = await this.teamMemberBriefQuery(req);
    filter = { ...filter, ...teamMemberBriefQuery };
  }
  delete filter.sentOrReceived;
  delete filter.mineOrTeamMember;
  delete filter.organization;

  return filter;
};

exports.getParticipatingBriefs = async (req) => {
  const filter = await this.participatingBriefsQuery(req);

  query = {
    IsDraft: { $ne: true },
    $and: [filter],
  };

  const entities = (
    await Brief.find(query)
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      })
      .populate({ path: 'Markets', model: 'Country', select: { name: 1 } })
      .populate({
        path: 'ClientId',
        model: 'CompanyProfile',
        select: { companyName: 1, logo: 1 },
        populate: {
          path: 'organization',
          model: 'Organization',
          select: { name: 1, logo: 1 },
        },
      })
      .sort({ createdAt: -1 })
  ).map((pb) => ({
    ...pb._doc,
    sent: true,
    isPublic: true,
  }));

  return entities;
};

exports.getBriefs = async (req) => {
  const filter = await this.getFilterQuery(req);
  const [byOrganizationQuery, receivedBriefsQuery] = await Promise.all([
    this.byOrganizationQuery(req),
    this.receivedBriefsQuery(req),
  ]);

  query = {
    IsDraft: { $ne: true },
    $and: [filter],
  };

  const briefMembers = await BriefMember.find({ UserId: req.user._id });

  const sentBriefs = (
    await Brief.find({ ...query, ...byOrganizationQuery })
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      })
      .populate({ path: 'Markets', model: 'Country', select: { name: 1 } })
      .populate({
        path: 'ClientId',
        model: 'CompanyProfile',
        select: { companyName: 1, logo: 1 },
        populate: {
          path: 'organization',
          model: 'Organization',
          select: { name: 1, logo: 1 },
        },
      })
  ).map((sb) => ({
    ...sb._doc,
    sent: true,
    isPublic: true,
    canEdit: canEditCondition(briefMembers, sb, req.user),
  }));

  const receivedBriefs = (
    await Brief.find({ ...query, ...receivedBriefsQuery })
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      })
      .populate({ path: 'Markets', model: 'Country', select: { name: 1 } })
      .populate({
        path: 'ClientId',
        model: 'CompanyProfile',
        select: { companyName: 1, logo: 1 },
        populate: {
          path: 'organization',
          model: 'Organization',
          select: { name: 1, logo: 1 },
        },
      })
  ).map((rb) => ({
    ...rb._doc,
    sent: false,
    isPublic: rb.NdaRequirementMode === 2 ? true : !!isPublicMap[rb._id],
  }));

  let entities = [...receivedBriefs, ...sentBriefs].sort((a, b) => b.createdAt - a.createdAt);

  // removing confidential briefs from filter results
  if ((!!filter && Object.keys(filter).includes('Categories')) || Object.keys(filter).includes('Markets')) {
    entities = entities.filter((brief) => brief.isPublic);
  }

  // removing duplicated briefs
  // entities = entities.filter((entity, index, self) =>
  // index === self.findIndex((t) => (  t._id.toString() === entity._id.toString())))

  return entities;
};

exports.getAdminBriefs = async (req) => {
  const filter = await this.getFilterQuery(req);
  query = {
    IsDraft: { $ne: true },
    $and: [filter],
  };

  const entities = (
    await Brief.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      })
      .populate({ path: 'Markets', model: 'Country', select: { name: 1 } })
      .populate({
        path: 'ClientId',
        model: 'CompanyProfile',
        select: { companyName: 1, logo: 1 },
        populate: {
          path: 'organization',
          model: 'Organization',
          select: { name: 1, logo: 1 },
        },
      })
  ).map((rb) => ({
    ...rb._doc,
    isPublic: true,
  }));

  return entities;
};

exports.setFastAccessPrivacy = async (req, entities) => {
  if (req.user.role === 'admin') {
    entities = entities
      .filter((e) => e.BriefId !== null)
      .map((e) => ({
        ...e._doc,
        BriefId: {
          ...e._doc.BriefId._doc,
          sent: true,
          isPublic: true,
        },
      }));
  } else {
    const briefIds = entities.map((e) => e.BriefId._id);
    const briefCompanies = await BriefSupplier.find({
      SupplierId: req.user.company,
      BriefId: { $in: briefIds },
    });
    const receivedBriefIds = briefCompanies.map((supplier) => supplier.BriefId?.toString());

    entities = entities.map((e) => {
      const briefSupplier = briefCompanies.find((bc) => e.BriefId._id?.toString() === bc.BriefId?.toString());
      return {
        ...e._doc,
        BriefId: {
          ...e._doc.BriefId._doc,
          sent: !receivedBriefIds.includes(e.BriefId._id?.toString()),
          isPublic: receivedBriefIds.includes(e.BriefId._id?.toString())
            ? e.BriefId.Nda === null ||
              e.BriefId.NdaRequirementMode === 2 ||
              (briefSupplier.NdaAcceptance === 1 && !!briefSupplier.SignedNda)
            : true,
        },
      };
    });
  }

  return entities;
};
