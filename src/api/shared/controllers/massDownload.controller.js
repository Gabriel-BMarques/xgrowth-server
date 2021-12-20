const httpStatus = require('http-status');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Organization = require('../../organization/model/organization.model');
const moment = require('moment-timezone');
const { isNil } = require('lodash');
const XLSX = require('xlsx');

exports.downloadOrganizations = async (req, res, next) => {
  try {
    const fileName = 'organizations.xlsx';
    const fileLines = [];

    const organizations = await Organization.find(
      {},
      {
        domain: 1,
        name: 1,
        createdBy: 1,
        allowedDomains: 1,
        categoryOrganizations: 1,
        segments: 1,
        skills: 1,
        certifications: 1,
        initiatives: 1,
        organizationAdmins: 1,
        organizationReach: 1,
        subSegments: 1,
        isComplete: 1,
        organizationType: 1,
        annualSales: 1,
        numberOfEmployees: 1,
        website: 1,
        yearFounded: 1,
        startupType: 1,
      }
    )
      .populate({
        path: 'categoryOrganizations',
        model: 'CategoryOrganization',
        select: ['name'],
      })
      .populate({
        path: 'segments',
        model: 'Segment',
        select: ['name'],
      })
      .populate({
        path: 'skills',
        model: 'Skills',
        select: ['name'],
      })
      .populate({
        path: 'certifications',
        model: 'Certification',
        select: ['name'],
      })
      .populate({
        path: 'initiatives',
        model: 'Initiative',
        select: ['name'],
      })
      .populate({
        path: 'organizationAdmins',
        model: 'User',
        select: ['UserName'],
      })
      .populate({
        path: 'organizationReach',
        model: 'Country',
        select: ['name'],
      })
      .populate({
        path: 'subSegments',
        model: 'Segment',
        select: ['name'],
      })
      .populate({
        path: 'organizationType',
        model: 'OrganizationType',
        select: ['name'],
      })
      .sort('name')
      .lean();

    for await (const organization of organizations) {
      const companies = await CompanyProfile.find(
        { organization: organization._id },
        { companyName: 1 }
      ).lean();

      const organizationAdmins =
        organization?.organizationAdmins
          ?.map((oa) => oa?.UserName)
          ?.filter((oaUserName) => !isNil(oaUserName) && oaUserName?.length > 0)
          ?.join(', ') || '';
      const allowedDomains =
        organization?.allowedDomains
          ?.filter((ad) => !isNil(ad) && ad?.length > 0)
          ?.join(', ') || '';
      const initiatives =
        organization?.initiatives
          ?.map((initiative) => initiative?.name)
          ?.filter(
            (initiativeName) =>
              !isNil(initiativeName) && initiativeName?.length > 0
          )
          ?.join(', ') || '';
      const countries =
        organization?.organizationReach
          ?.map((country) => country?.name)
          ?.filter(
            (countryName) => !isNil(countryName) && countryName?.length > 0
          )
          ?.join(', ') || '';
      const certifications = organization?.certifications
        ?.map((certification) => certification?.name)
        ?.filter(
          (certificationName) =>
            !isNil(certificationName) && certificationName?.length > 0
        )
        ?.join(', ');
      const skills =
        organization?.skills
          ?.map((skill) => skill?.name)
          ?.filter((skillName) => !isNil(skillName) && skillName?.length > 0)
          ?.join(', ') || '';
      const segments =
        organization?.segments
          ?.map((segment) => segment?.name)
          ?.filter(
            (segmentName) => !isNil(segmentName) && segmentName?.length > 0
          )
          ?.join(', ') || '';
      const subSegments =
        organization?.subSegments
          ?.map((ss) => ss?.name)
          ?.filter((ssName) => !isNil(ssName) && ssName?.length > 0)
          ?.join(', ') || '';
      const organizationCategories =
        organization?.categoryOrganizations
          ?.map((co) => co?.name)
          ?.filter((coName) => !isNil(coName) && coName?.length > 0)
          ?.join(', ') || '';
      const companyNames = companies
        ?.map((company) => company.companyName)
        ?.filter(
          (companyName) => !isNil(companyName) && companyName?.length > 0
        )
        ?.join(', ');

      fileLines.push({
        'Organization name': organization?.name || '',
        Domain: organization?.domain || '',
        'Is complete': organization?.isComplete ? 'Yes' : 'No' || '',
        'Organization admins': organizationAdmins || '',
        'Allowed domains': allowedDomains || '',
        'Year founded': organization?.yearFounded || '',
        Website: organization?.website || '',
        'Number of employees': organization?.numberOfEmployees || '',
        'Annual sales': organization?.annualSales || '',
        'Organization type': organization?.organizationType?.name || '',
        'Organization reach': countries || '',
        Initiatives: initiatives || '',
        Certifications: certifications || '',
        Skills: skills || '',
        Segments: segments || '',
        'Sub segments': subSegments || '',
        'Organization categories': organizationCategories || '',
        'Startup type': organization?.startupType || '',
        Companies: companyNames || '',
      });
    }

    return sendBuffer(fileLines, fileName, res);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.downloadCompanies = async (req, res, next) => {
  try {
    const fileName = 'companies.xlsx';
    const fileLines = [];

    const companies = await CompanyProfile.find(
      {},
      {
        organization: 1,
        companyName: 1,
        createdBy: 1,
        Email: 1,
        Phone: 1,
        country: 1,
        Type: 1,
        postLimit: 1,
        postWaitDays: 1,
        numberOfPosts: 1,
        hasWebinarAccess: 1,
        LastActivity: 1,
      }
    )
      .populate({
        path: 'organization',
        model: 'Organization',
        select: ['name'],
      })
      .populate({ path: 'country', model: 'Country', select: ['name'] })
      .populate({ path: 'createdBy', model: 'User', select: ['UserName'] })
      .sort('companyName')
      .lean();

    Object.entries(companies).forEach(([key, val]) => {
      fileLines.push({
        'Company name': val?.companyName || '',
        'Organization name': val?.organization?.name || '',
        Email: val?.Email || '',
        Phone: val?.Phone || '',
        Country: val?.country?.name || '',
        Type: val?.Type || '',
        'Has webinar access': val?.hasWebinarAccess ? 'Yes' : 'No' || '',
        'Created by': val?.createdBy?.UserName || '',
        'Number of posts': val?.numberOfPosts?.toString() || '',
        'Post limit': val?.postLimit?.toString() || '',
        'Post wait days': val?.postWaitDays?.toString() || '',
        'Last activity': val?.LastActivity
          ? moment(new Date(val?.LastActivity)).format('DD/MM/YYYY')
          : '' || '',
      });
    });

    return sendBuffer(fileLines, fileName, res);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const sendBuffer = (fileLines, fileName, res) => {
  try {
    const ws = XLSX.utils.json_to_sheet(fileLines);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);

    const opts = { bookType: 'xlsx', bookSST: false, type: 'buffer' };
    const buffer = XLSX.write(wb, opts);

    res.status(httpStatus.OK);
    res.send({ buffer, fileName });
  } catch (error) {
    console.log(error);
  }
};
