import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import New from "../new";

function CreateNewPage() {
  return <New initialType="page" />;
}

export default withDashboardLayout(CreateNewPage);
