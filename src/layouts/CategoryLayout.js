import { Outlet } from 'react-router-dom';
 
export default function CategoryLayout() {
  return (
    <div>
      {/* You can add a back button, category name header, etc. here */}
      <Outlet />
    </div>
  );
}