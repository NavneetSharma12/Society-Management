
import { PermissionProvider } from '../contexts/PermissionContext';
import AdminPanel from './AdminPanel';

const Index = () => {
  return (
    <PermissionProvider>
      <AdminPanel />
    </PermissionProvider>
  );
};

export default Index;
