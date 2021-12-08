const adminServices = require('./AdminServices')

class AdminController {
    // [GET] /admin-profile
    async adminProfile(req, res) {
        const userInfo = await adminServices.findAdmin(req.user.username)
        res.render('admin/admin-profile', { userInfo })
    }

    // [GET] /admins-list
    async adminsList(req, res) {
        const limit = 5
        let page
        if (req.query.page == undefined) {
            page = 1
        }
        else {
            page = req.query.page
        }

        const { admins, count } = await adminServices.getAllAdmins(page, limit)

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / limit)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        res.render('admin/admins-list', {
            admins,
            // Use for pagination
            path: "/admin/admins-list?page=",
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            lastPage: totalPage,
            isPreValid,
            isNextValid,
        })
    }

    //[GET] /add-account
    addAdminPage(req, res) {
        res.render('admin/add-admin')
    }

    //[POST] /add-account
    async addNewAdmin(req, res) {
        const isAdded = await adminServices.addNewAdmin(req.body)
        res.redirect('/admin/admins-list')
    }
}

module.exports = new AdminController