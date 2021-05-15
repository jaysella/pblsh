import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import New from "../new";

function CreateNewFolder() {
  return <New initialType="folder" />;
}

export default withDashboardLayout(CreateNewFolder);
