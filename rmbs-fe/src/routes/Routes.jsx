import CreateMortgage from "../pages/CreateMortgage/CreateMortgage";
import MortgageList from "../pages/MortgageListing/MortgageListing";

export const routes = [
  {
    path: '/create',
    element: <CreateMortgage />,
  },
  {
    path: '/',
    element: <MortgageList />,
  }
];
