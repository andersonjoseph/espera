import { Suspense } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { WaitlistForm } from './WaitlistForm';
import { UsersTable } from './UsersTable';
import { Analytics } from './Analytics';
import { ExportForm } from './Export';

export function Waitlist() {
  return (
    <>
      <h2 className="text-lg font-medium text-slate-900 mb-5">Test1</h2>
      <Tabs>
        <TabList className="mb-5">
          <Tab>
            <span className="text-slate-800">General</span>
          </Tab>
          <Tab>
            <span className="text-slate-800">Usuarios</span>
          </Tab>
          <Tab>
            <span className="text-slate-800">Estadísticas</span>
          </Tab>
          <Tab>
            <span className="text-slate-800">Exportar</span>
          </Tab>
        </TabList>

        <TabPanel>
          <WaitlistForm />
        </TabPanel>

        <TabPanel>
          <Suspense fallback={null}>
            <UsersTable />
          </Suspense>
        </TabPanel>

        <TabPanel>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </TabPanel>

        <TabPanel>
          <Suspense fallback={null}>
            <ExportForm />
          </Suspense>
        </TabPanel>
      </Tabs>
    </>
  );
}
