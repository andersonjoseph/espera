import { Suspense } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { WaitlistForm } from './WaitlistForm';
import { UsersTable } from './UsersTable';
import { Analytics } from './Analytics';
import { ExportForm } from './Export';
import { useRoute } from 'wouter';
import { suspend } from 'suspend-react';
import { useWaitlistApi } from '../api/useWaitlistApi';

export function Waitlist() {
  const [_, params] = useRoute('/waitlist/:id');
  const { getWaitlist } = useWaitlistApi();

  const waitlistData = suspend(async () => {
    return getWaitlist(params.id);
  }, ['waitlist', params.id]);

  return (
    <>
      <h2 className="text-lg font-medium text-slate-900 mb-5">
        {waitlistData.name}
      </h2>
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
          <Suspense fallback={null}>
            <WaitlistForm />
          </Suspense>
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
