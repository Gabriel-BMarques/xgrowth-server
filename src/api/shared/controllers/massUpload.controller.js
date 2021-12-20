const XLSX = require('xlsx');
const httpStatus = require('http-status');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Organization = require('../../organization/model/organization.model');
const OrganizationType = require('../../organization/model/organizationType.model');
const Segments = require('../../organization/model/segment.model');
const Skills = require('../../organization/model/skills.model');
const Country = require('../models/country.model');
const { isNil, omit } = require('lodash');

exports.massUpload = async (req, res, next) => {
  try {
    const { buffer } = req.file;

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames]);

    // file not empty
    if (data.length > 0) {
      const templateType = defineTemplateType(data[0]);
      let organizationErrors;
      let companyErrors;

      // define template type and check errors of the template
      switch (templateType) {
        case 'organization':
          organizationErrors = await checkOrganizationErrors(data);
          break;
        case 'company':
          companyErrors = await checkCompanyErrors(data);
          break;
        default:
          res.status(httpStatus.NOT_FOUND);
          throw new Error(
            JSON.stringify({
              'en-US': 'Cannot define template type!',
              'pt-BR': 'Não foi possível identificar o tipo do mass upload!',
            })
          );
      }

      // verify template type and mass upload data
      if (!isNil(organizationErrors)) {
        if (organizationErrors.ok) {
          await Promise.all(
            data.map(async (organization) => {
              try {
                const oldOrganization = await Organization.findOne({
                  name: organization.name,
                });

                const newOrganization = new Organization(organization);
                newOrganization.updatedBy = req.user._id;

                const organizationToUpdate = omit(
                  newOrganization.toObject(),
                  '_id',
                  '__v',
                  'canEdit',
                  'updatedAt'
                );

                await oldOrganization.updateOne(organizationToUpdate, {
                  override: false,
                  upsert: true,
                });
              } catch (err) {
                const newOrganization = new Organization(organization);
                newOrganization.createdBy = req.user._id;
                await newOrganization.save();
              }
            })
          );
        } else {
          throw new Error(JSON.stringify(organizationErrors.message));
        }
      } else if (!isNil(companyErrors)) {
        if (companyErrors.ok) {
          await Promise.all(
            data.map(async (company) => {
              try {
                const oldCompany = await CompanyProfile.findOne({
                  companyName: company.companyName,
                });

                const newCompany = new CompanyProfile(company);
                newCompany.updatedBy = req.user._id;

                const companyToUpdate = omit(
                  newCompany.toObject(),
                  '_id',
                  '__v',
                  'canEdit',
                  'updatedAt'
                );

                await oldCompany.updateOne(companyToUpdate, {
                  override: false,
                  upsert: true,
                });
              } catch (err) {
                const newCompany = new CompanyProfile(company);
                newCompany.createdBy = req.user._id;
                newCompany.allowedDomain = req.user.email.split('@')[1];
                await newCompany.save();
              }
            })
          );
        } else {
          throw new Error(JSON.stringify(companyErrors.message));
        }
      }
    } else {
      res.status(httpStatus.NOT_FOUND);
      throw new Error(
        JSON.stringify({
          'en-US': 'The uploaded file is empty!',
          'pt-BR': 'O arquivo enviado está vazio!',
        })
      );
    }

    res.status(httpStatus.CREATED);
    return res.json({ msg: 'Mass upload successfully finished!' });
  } catch (err) {
    return next(err);
  }
};

const defineTemplateType = (row) => {
  if (
    row['Allowed domains'] ||
    row.Segments ||
    row.Skills ||
    row['Organization reach'] ||
    row['Organization type'] ||
    row['Startup type']
  ) {
    return 'organization';
  } else if (
    row['Company name'] ||
    row.Country ||
    row['Post limit'] ||
    row['Post wait days']
  ) {
    return 'company';
  } else {
    return 'undefined';
  }
};

const checkOrganizationErrors = async (organizations) => {
  try {
    let isErrored = false;
    let index = 1;
    const organizationsStructureErrored = [];
    const structureLinesNumbers = [];
    const fieldsNotFoundInDB = [];
    const fieldsLinesNumbers = [];

    for await (const organization of organizations) {
      let fileStructureErrored = false;
      let fieldsNotFoundErrored = false;
      index++;

      // verify file structure and missing fields
      if (!organization['Organization name']) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Organization name') &&
          organizationsStructureErrored.push('Organization name');
      }
      if (!organization['Allowed domains']) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Allowed domains') &&
          organizationsStructureErrored.push('Allowed domains');
      }
      if (!organization.Segments) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Segments') &&
          organizationsStructureErrored.push('Segments');
      }
      if (!organization.Skills) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Skills') &&
          organizationsStructureErrored.push('Skills');
      }
      if (!organization['Organization reach']) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Organization reach') &&
          organizationsStructureErrored.push('Organization reach');
      }
      if (!organization['Organization type']) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Organization type') &&
          organizationsStructureErrored.push('Organization type');
      }
      if (!organization['Startup type']) {
        fileStructureErrored = true;
        !organizationsStructureErrored.includes('Startup type') &&
          organizationsStructureErrored.push('Startup type');
      }

      // catch file structure error (missing fields)
      if (fileStructureErrored) {
        structureLinesNumbers.push(index);
        isErrored = true;
        continue;
      }

      // format the items as array
      const allowedDomains = organization['Allowed domains']
        .split(';')
        .map((item) => item.trim());
      const segments = organization.Segments.split(';').map((item) =>
        item.trim()
      );
      const skills = organization.Skills.split(';').map((item) => item.trim());
      const organizationReach = organization['Organization reach']
        .split(';')
        .map((item) => item.trim());

      // try to find items in the database
      const segmentsIds = await Segments.find(
        { name: { $in: segments } },
        { _id: 1 }
      ).lean();
      const skillsIds = await Skills.find(
        { name: { $in: skills } },
        { _id: 1 }
      ).lean();
      const organizationReachIds = await Country.find(
        { name: { $in: organizationReach } },
        { _id: 1 }
      ).lean();
      const organizationTypeId = await OrganizationType.findOne(
        { name: { $in: organization['Organization type'] } },
        { _id: 1 }
      ).lean();

      // verify if field exists in the database
      if (segmentsIds.length === 0) {
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Segments') &&
          fieldsNotFoundInDB.push('Segments');
      }

      if (skillsIds.length === 0) {
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Skills') &&
          fieldsNotFoundInDB.push('Skills');
      }

      if (organizationReachIds.length === 0) {
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Organization reach') &&
          fieldsNotFoundInDB.push('Organization reach');
      }

      if (!organizationTypeId) {
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Organization type') &&
          fieldsNotFoundInDB.push('Organization type');
      }

      // catch field not found in the database error
      if (fieldsNotFoundErrored) {
        fieldsLinesNumbers.push(index);
        isErrored = true;
        continue;
      }

      // formatting the organization object to save in the database
      const newOrganization = {
        name: organization['Organization name'].trim(),
        allowedDomains: allowedDomains,
        segments: segmentsIds,
        skills: skillsIds,
        organizationReach: organizationReachIds,
        organizationType: organizationTypeId._id,
        startupType: organization['Startup type'].trim(),
      };

      organizations.splice(index - 2, 1, newOrganization);
    }

    if (isErrored) {
      let messageBR = '';
      let messageUS = '';

      if (organizationsStructureErrored.length > 0) {
        messageBR +=
          'Uma ou mais linhas do arquivo não possuem os campos: ' +
          organizationsStructureErrored.join(', ') +
          ' (Linhas incorretas: ' +
          structureLinesNumbers.join(', ') +
          '). ';
        messageUS +=
          "One or more lines of the file doesn't have the fields: " +
          organizationsStructureErrored.join(', ') +
          ' (Lines errored: ' +
          structureLinesNumbers.join(', ') +
          '). ';
      }

      if (fieldsNotFoundInDB.length > 0) {
        messageBR +=
          'Esses valores não foram encontrados: ' +
          fieldsNotFoundInDB.join(', ') +
          ' (Linhas incorretas: ' +
          fieldsLinesNumbers.join(', ') +
          '). ';
        messageUS +=
          'These values cannot be found: ' +
          fieldsNotFoundInDB.join(', ') +
          ' (Lines errored: ' +
          fieldsLinesNumbers.join(', ') +
          '). ';
      }

      return {
        ok: false,
        message: {
          'en-US': messageUS,
          'pt-BR': messageBR,
        },
      };
    }

    return {
      ok: true,
      message: null,
    };
  } catch (err) {
    throw err;
  }
};

const checkCompanyErrors = async (companies) => {
  try {
    let isErrored = false;
    let index = 1;
    const companiesStructureErrored = [];
    const structureLinesNumbers = [];
    const fieldsShouldBeANumber = [];
    const numbersLinesNumbers = [];
    const fieldsNotFoundInDB = [];
    const fieldsLinesNumbers = [];

    for await (const company of companies) {
      let fileStructureErrored = false;
      let fieldsShouldBeANumberErrored = false;
      let fieldsNotFoundErrored = false;
      index++;

      // verify file structure and missing fields
      if (!company['Company name']) {
        fileStructureErrored = true;
        !companiesStructureErrored.includes('Company name') &&
          companiesStructureErrored.push('Company name');
      }
      if (!company['Organization name']) {
        fileStructureErrored = true;
        !companiesStructureErrored.includes('Organization name') &&
          companiesStructureErrored.push('Organization name');
      }
      if (!company.Country) {
        fileStructureErrored = true;
        !companiesStructureErrored.includes('Country') &&
          companiesStructureErrored.push('Country');
      }

      // catch file structure error (missing fields)
      if (fileStructureErrored) {
        structureLinesNumbers.push(index);
        isErrored = true;
        continue;
      }

      // verify if post limit and post wait days are numbers
      if (
        isNaN(company['Post limit']) ||
        (!isNaN(company['Post limit']) && company['Post limit'] < 0)
      ) {
        fieldsShouldBeANumberErrored = true;
        !fieldsShouldBeANumber.includes('Post limit') &&
          fieldsShouldBeANumber.push('Post limit');
      }
      if (
        isNaN(company['Post wait days']) ||
        (!isNaN(company['Post wait days']) && company['Post wait days'] < 0)
      ) {
        fieldsShouldBeANumberErrored = true;
        !fieldsShouldBeANumber.includes('Post wait days') &&
          fieldsShouldBeANumber.push('Post wait days');
      }
      if (fieldsShouldBeANumberErrored) {
        numbersLinesNumbers.push(index);
        isErrored = true;
        continue;
      }

      // verify if items exists in the database
      let organizationId;
      try {
        organizationId = await Organization.findOne(
          { name: company['Organization name'].trim() },
          { _id: 1 }
        ).lean();
      } catch (err) {
        // mongoose post('findOne') in the model triggers this
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Organization name') &&
          fieldsNotFoundInDB.push('Organization name');
      }

      const countryId = await Country.findOne(
        { name: company.Country.trim() },
        { _id: 1 }
      ).lean();

      if (!countryId) {
        fieldsNotFoundErrored = true;
        !fieldsNotFoundInDB.includes('Country') &&
          fieldsNotFoundInDB.push('Country');
      }

      // catch field not found in the database error
      if (fieldsNotFoundErrored) {
        fieldsLinesNumbers.push(index);
        isErrored = true;
        continue;
      }

      // formatting the company object to save in the database
      const newCompany = {
        companyName: company['Company name'].trim(),
        organization: organizationId._id,
        country: countryId._id,
        postLimit: Math.ceil(company['Post limit']),
        postWaitDays: Math.ceil(company['Post wait days']),
      };

      companies.splice(index - 2, 1, newCompany);
    }

    if (isErrored) {
      let messageBR = '';
      let messageUS = '';

      if (companiesStructureErrored.length > 0) {
        messageBR +=
          'Uma ou mais linhas do arquivo não possuem os campos: ' +
          companiesStructureErrored.join(', ') +
          ' (Linhas incorretas: ' +
          structureLinesNumbers.join(', ') +
          '). ';
        messageUS +=
          "One or more lines of the file doesn't have the fields: " +
          companiesStructureErrored.join(', ') +
          ' (Lines errored: ' +
          structureLinesNumbers.join(', ') +
          '). ';
      }

      if (fieldsShouldBeANumber.length > 0) {
        messageBR +=
          'Esses campos devem ser um número maior ou igual a zero: ' +
          fieldsShouldBeANumber.join(', ') +
          ' (Linhas incorretas: ' +
          numbersLinesNumbers.join(', ') +
          '). ';
        messageUS +=
          'These fields should be a number equal or greater than zero: ' +
          fieldsShouldBeANumber.join(', ') +
          ' (Lines errored: ' +
          numbersLinesNumbers.join(', ') +
          '). ';
      }

      if (fieldsNotFoundInDB.length > 0) {
        messageBR +=
          'Esses valores não foram encontrados: ' +
          fieldsNotFoundInDB.join(', ') +
          ' (Linhas incorretas: ' +
          fieldsLinesNumbers.join(', ') +
          '). ';
        messageUS +=
          'These values cannot be found: ' +
          fieldsNotFoundInDB.join(', ') +
          ' (Lines errored: ' +
          fieldsLinesNumbers.join(', ') +
          '). ';
      }

      return {
        ok: false,
        message: {
          'en-US': messageUS,
          'pt-BR': messageBR,
        },
      };
    }

    return {
      ok: true,
      message: null,
    };
  } catch (err) {
    throw err;
  }
};
