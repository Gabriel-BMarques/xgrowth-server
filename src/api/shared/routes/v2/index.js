const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const mailRoutes = require('./mail.route');
const mailAction = require('./mailAction.route')
const miscRoutes = require('./misc.route');
const companyProfileRoutes = require('./companyProfile.route');
const companyRelationRoutes = require('./companyRelation.route');
const organizationRoutes = require('./organization.route');
const lineRoutes = require('./line.route');
const listingRoutes = require('./listing.route');
const requestRoutes = require('./request.route');
const notificationRoutes = require('./notification.route');
const notificationUserRoutes = require('./notificationUser.route');
const notificationDeviceRoutes = require('./notificationDevice.route');
const clientProfileRoutes = require('./profile.route');
const plantRoutes = require('./plant.route');
const productRoutes = require('./product.route');
const postRoutes = require('./post.route');
const postRatingRoutes = require('./postRating.route');
const inviteRoutes = require('./invite.route');
const searchRoutes = require('./search.route');
const uploadRoutes = require('./file.route');
const collectionsRoutes = require('./collections.route');
const collectionPostRoutes = require('./collectionPost.route');
const categoryRoutes = require('./category.route');
const categoryPostRoutes = require('./categoryPost.route');
const categoryBriefRoutes = require('./briefCategory.route');
const categoryUserRoutes = require('./categoryUser.route');
const categoryClientRoutes = require('./categoryClient.route');
const categoryOfUserRoutes = require('./categoryOfUser.route');
const postCompanyRoutes = require('./postCompany.route');
const interestRoutes = require('./interest.route');
const briefCategory = require('./briefCategory.route');
const briefMarket = require('./briefMarket.route');
const briefMember = require('./briefMember.route');
const briefSupplier = require('./briefSupplier.route');
const briefRoutes = require('./brief.route');
const skillsRoutes = require('./skills.route');
const segmentsRoutes = require('./segment.route');
const categoryOrganizationRoutes = require('./categoryOrganization.route');
const businessUnit = require('./businessUnit.route');
const companyTypeRoutes = require('./companyType.route');
const tutorialRoutes = require('./tutorial.route');
const tutorialReactionRoutes = require('./tutorialReaction.route');
const webinarRoutes = require('./webinar.route');
const webinarInvitationRoutes = require('./webinarInvitation.route');
const massUploadRoutes = require('./massUpload.route');
const massDownloadRoutes = require('./massDownload.route');

const router = express.Router();

/**
 * GET v2/status
 */
router.get('/status', (req, res) => res.send('Server OK'));

/**
 * GET v2/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/mail', mailRoutes);
router.use('/mail-action', mailAction);
router.use('/collections', collectionsRoutes);
router.use('/collection-post', collectionPostRoutes);
router.use('/category-post', categoryPostRoutes);
router.use('/category-brief', categoryBriefRoutes);
router.use('/category-user', categoryUserRoutes);
router.use('/category-client', categoryClientRoutes);
router.use('/category-of-user', categoryOfUserRoutes);
router.use('/category', categoryRoutes);
router.use('/misc', miscRoutes);
router.use('/company-profile', companyProfileRoutes);
router.use('/company-relation', companyRelationRoutes);
router.use('/organization', organizationRoutes);
router.use('/line', lineRoutes);
router.use('/listing', listingRoutes);
router.use('/request', requestRoutes);
router.use('/notification', notificationRoutes);
router.use('/notification-user', notificationUserRoutes);
router.use('/notification-device', notificationDeviceRoutes);
router.use('/client-profile', clientProfileRoutes);
router.use('/plant', plantRoutes);
router.use('/product', productRoutes);
router.use('/brief', briefRoutes);
router.use('/post', postRoutes);
router.use('/post-rating', postRatingRoutes);
router.use('/invite', inviteRoutes);
router.use('/search', searchRoutes);
router.use('/upload', uploadRoutes);
router.use('/organization', organizationRoutes);
router.use('/post-company', postCompanyRoutes);
router.use('/interests', interestRoutes);
router.use('/skills', skillsRoutes);
router.use('/segments', segmentsRoutes);
router.use('/category-organization', categoryOrganizationRoutes);
router.use('/brief-market', briefMarket);
router.use('/brief-member', briefMember);
router.use('/brief-supplier', briefSupplier);
router.use('/brief-category', briefCategory);
router.use('/businessUnit', businessUnit);
router.use('/company-type', companyTypeRoutes);
router.use('/tutorial', tutorialRoutes);
router.use('/tutorial-reaction', tutorialReactionRoutes);
router.use('/webinar', webinarRoutes);
router.use('/webinar-invitation', webinarInvitationRoutes);
router.use('/mass-upload', massUploadRoutes);
router.use('/mass-download', massDownloadRoutes);

module.exports = router;
