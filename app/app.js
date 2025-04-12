import cors from 'cors';  // 🔹 Importar CORS
import express from 'express';
import updateExitRoutes from '../routes/updateExit.Routes.js';
import colorsRoutes from '../routes/colors.Routes.js';
import AddressRoutes from '../routes/Address.Routes.js';
import AddressProfileRoutes from '../routes/AddressProfile.Routes.js';
import companyRoutes from '../routes/company.Routes.js';
import companyProductRoutes from '../routes/companyProduct.Routes.js';
import stateOrderRoutes from '../routes/stateOrder.Routes.js';
import stateUserRoutes from '../routes/stateUser.Routes.js';
import BillRoutes from '../routes/bill.Routes.js';
import IncomeRoutes from '../routes/Income.Routes.js';
import BrandRoutes from '../routes/brand.Routes.js';
import paymentMethodRoutes from '../routes/paymentMethod.Routes.js';
import paymentMethod_orderRoutes from '../routes/paymentMethod_order.Routes.js';
import moduleRoutes from '../routes/module.Routes.js';
import orderRoutes from '../routes/order.Routes.js';
import profileRoutes from '../routes/profile.Routes.js';
import productRoutes from '../routes/products.Routes.js';
import productOrderRoutes from '../routes/productOrder.Routes.js';
import roleRoutes from '../routes/role.Routes.js';
import roleModuleRoutes from '../routes/roleModule.Routes.js';
import ExitRoutes from '../routes/exit.Routes.js';
import sizeRoutes from '../routes/size.Routes.js';
import usersRoutes from '../routes/users.Routes.js';
import userApiRoutes from '../routes/apiUser.routes.js';

const app = express();

app.use(cors({
    origin: "*",  // Puedes cambiar "*" por "http://localhost:5501" si solo permites tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use('/api_v1', updateExitRoutes);
app.use('/api_v1', colorsRoutes);
app.use('/api_v1', AddressRoutes);
app.use('/api_v1', AddressProfileRoutes);
app.use('/api_v1', companyRoutes);
app.use('/api_v1', companyProductRoutes);
app.use('/api_v1', stateOrderRoutes);
app.use('/api_v1', stateUserRoutes);
app.use('/api_v1', BillRoutes);
app.use('/api_v1', IncomeRoutes);
app.use('/api_v1', BrandRoutes);
app.use('/api_v1', paymentMethodRoutes);
app.use('/api_v1', paymentMethod_orderRoutes);
app.use('/api_v1', moduleRoutes);
app.use('/api_v1', orderRoutes);
app.use('/api_v1', profileRoutes);
app.use('/api_v1', productRoutes);
app.use('/api_v1', productOrderRoutes);
app.use('/api_v1', roleRoutes);
app.use('/api_v1', roleModuleRoutes);
app.use('/api_v1', ExitRoutes);
app.use('/api_v1', sizeRoutes);
app.use('/api_v1', usersRoutes);
app.use('/api_v1', userApiRoutes);



app.use((rep, res, nex) => {
    res.status(404).json({
        message: 'Endpoint losses'
    });
});

export default app;


