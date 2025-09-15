/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related endpoints
 *
 *   - name: Admin - User
 *     description: Admin endpoints for managing users
 *
 *   - name: Admin - Category
 *     description: Admin endpoints for managing categories
 *
 *   - name: Admin - Product
 *     description: Admin endpoints for managing products and skus
 *
 *   - name: Admin - Coupon
 *     description: Admin endpoints for managing coupons
 *
 *   - name: Admin - Order
 *     description: Admin endpoints for managing orders
 *
 *   - name: Cart
 *     description: User cart management endpoints
 *
 *   - name: Order
 *     description: User order related endpoints
 *
 *   - name: Products
 *     description: Public product browsing endpoints
 *
 *   - name: User
 *     description: General user profile and account endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: '+919594331923'
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: shaikhmuhid165@gmail.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change password (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Old password incorrect or mismatch
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   put:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: OTP sent to email
 *       400:
 *         description: User not registered
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or mismatch
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default 10)
 *     responses:
 *       200:
 *         description: List of users with pagination
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User does not exist
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Admin - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               username:
 *                 type: string
 *                 example: updateduser
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Soft delete user by ID
 *     tags: [Admin - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/admin/users/status/{id}:
 *   put:
 *     summary: Change user account status (activate/deactivate)
 *     tags: [Admin - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Set to `true` to activate, `false` to deactivate
 *                 example: true
 *     responses:
 *       200:
 *         description: User status changed successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories (paginated)
 *     tags: [Admin - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default 10)
 *     responses:
 *       200:
 *         description: List of categories with pagination
 *       404:
 *         description: No categories found
 */

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin - Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 */

/**
 * @swagger
 * /api/admin/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Admin - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/admin/category/status/{id}:
 *   delete:
 *     summary: Change category status (activate/deactivate)
 *     tags: [Admin - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Set `false` to deactivate (soft delete), `true` to activate
 *                 example: false
 *     responses:
 *       200:
 *         description: Category status updated successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/admin/category/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Admin - Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/admin/product:
 *   post:
 *     summary: Add a new product with SKUs
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - productName
 *               - description
 *               - brand
 *               - skus
 *             properties:
 *               categoryId:
 *                 type: integer
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               skus:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attributes:
 *                       type: object
 *                     skuCode:
 *                       type: string
 *                     productPrice:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     stock:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Product added successfully
 *       400:
 *         description: Missing required fields or duplicate product
 */

/**
 * @swagger
 * /api/admin/product/{id}:
 *   put:
 *     summary: Update product details
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/admin/product/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/admin/product/status/{id}:
 *   put:
 *     summary: Change product status (activate/deactivate) and update related SKUs
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Set `true` to activate, `false` to deactivate
 *                 example: false
 *     responses:
 *       200:
 *         description: Product and related SKUs status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found
 */

/**
 * @swagger
 * /api/admin/sku/{productId}:
 *   post:
 *     summary: Add a new SKU to a product
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - attributes
 *               - skuCode
 *               - productPrice
 *               - stock
 *             properties:
 *               productId:
 *                 type: number
 *               attributes:
 *                 type: object
 *               skuCode:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: SKU created successfully
 *       400:
 *         description: SKU already exists or invalid data
 */

/**
 * @swagger
 * /api/admin/sku/{id}:
 *   put:
 *     summary: Update an SKU
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               attributes:
 *                 type: object
 *               skuCode:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: SKU updated successfully
 *       404:
 *         description: SKU not found
 */

/**
 * @swagger
 * /api/admin/sku/{id}:
 *   delete:
 *     summary: Soft delete an SKU
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: SKU deleted successfully
 *       404:
 *         description: SKU not found
 */
/**
 * @swagger
 * /api/admin/sku/status/{id}:
 *   put:
 *     summary: Change SKU status (activate/deactivate)
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the SKU to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: Set to true to activate or false to deactivate the SKU
 *     responses:
 *       200:
 *         description: SKU status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: SKU not found
 */

/**
 * @swagger
 * /api/admin/sku/all:
 *   get:
 *     summary: Get all SKUs with pagination
 *     tags: [Admin - Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of SKUs with pagination
 *       404:
 *         description: No SKUs found
 */

/**
 * @swagger
 * /api/admin/coupons:
 *   get:
 *     summary: Get all coupons with pagination
 *     tags: [Admin - Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of coupons
 *       404:
 *         description: No coupons found
 */

/**
 * @swagger
 * /api/admin/coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Admin - Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - validTo
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *               discountValue:
 *                 type: number
 *               minOrderValue:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Coupon already exists
 */

/**
 * @swagger
 * /api/admin/coupon/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Admin - Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *               discountValue:
 *                 type: number
 *               minOrderValue:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Coupon does not exist
 */

/**
 * @swagger
 * /api/admin/coupon/status/{id}:
 *   put:
 *     summary: Change coupon status (activate/deactivate)
 *     tags: [Admin - Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Set `true` to activate, `false` to deactivate
 *                 example: true
 *     responses:
 *       200:
 *         description: Coupon status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /api/admin/orders/all:
 *   get:
 *     summary: Get all orders with pagination
 *     tags: [Admin - Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of orders
 *       404:
 *         description: No orders found
 */

/**
 * @swagger
 * /api/admin/order/{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Admin - Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, SHIPPED, DELIVERED, CANCELLED]
 *                 example: SHIPPED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status provided
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not logged in
 *
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Not logged in
 *       404:
 *         description: User not found
 *
 *   delete:
 *     summary: Delete logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not logged in
 */

/**
 * @swagger
 * /api/user/address:
 *   get:
 *     summary: Get all addresses of the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of addresses
 *       400:
 *         description: Login required
 *       404:
 *         description: No addresses found
 *
 *   post:
 *     summary: Add a new shipping address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine1
 *               - postalCode
 *               - city
 *               - state
 *               - country
 *               - addressType
 *             properties:
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               postalCode:
 *                 type: integer
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               defaultAddress:
 *                 type: boolean
 *                 example: true
 *               addressType:
 *                 type: string
 *                 example: HOME
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Login required
 */
/**
 * @swagger
 * /api/user/address/{id}:
 *   delete:
 *     summary: Delete a specific address of the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       400:
 *         description: Login required
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/category:
 *   get:
 *     summary: Get products by category with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of products under the given category
 *       400:
 *         description: Category name missing or invalid
 *       404:
 *         description: No products found for the category
 */

/**
 * @swagger
 * /api/products/sku/{id}:
 *   get:
 *     summary: Get SKU details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: SKU ID
 *     responses:
 *       200:
 *         description: SKU details
 *       404:
 *         description: SKU not found
 */

/**
 * @swagger
 * /api/cart/mycart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Returns the user's cart with items
 *       404:
 *         description: Cart not found or empty
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skuId
 *               - quantity
 *             properties:
 *               skuId:
 *                 type: integer
 *                 description: SKU ID of the product
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *     responses:
 *       200:
 *         description: Item added or updated in the cart
 *       400:
 *         description: Invalid input or SKU not found
 */

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItemId
 *               - quantity
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: ID of the cart item
 *               quantity:
 *                 type: integer
 *                 description: New quantity (0 or less removes the item)
 *     responses:
 *       200:
 *         description: Cart item updated or removed
 *       404:
 *         description: Cart item not found
 */

/**
 * @swagger
 * /api/cart/remove-item/{cartItemId}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart item
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       404:
 *         description: Cart item not found
 */

/**
 * @swagger
 * /api/cart/delete:
 *   delete:
 *     summary: Delete the entire cart for the logged-in user
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /api/order/checkout:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: integer
 *                 description: Shipping address ID
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code for discounts
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid coupon or order requirement not met
 *       401:
 *         description: Unauthorized (login required)
 *       404:
 *         description: Cart or shipping address not found
 */

/**
 * @swagger
 * /api/order/cancel/{id}:
 *   put:
 *     summary: Cancel an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized (login required)
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/order/history:
 *   get:
 *     summary: Get order history for the logged-in user
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Paginated order history
 *       401:
 *         description: Unauthorized (login required)
 *       404:
 *         description: No order history found
 */

/**
 * @swagger
 * /api/order/status/{id}:
 *   get:
 *     summary: Check status of a specific order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Current status of the order
 *       401:
 *         description: Unauthorized (login required)
 *       404:
 *         description: Order not found
 */
/**
 * @swagger
 * /api/order/repeat/{orderId}:
 *   post:
 *     summary: Repeat a previous order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to repeat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: integer
 *                 description: Shipping address ID for the new order
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code to apply
 *     responses:
 *       200:
 *         description: Successfully repeated order
 *       401:
 *         description: Unauthorized (user not logged in)
 *       404:
 *         description: Order not found
 */
