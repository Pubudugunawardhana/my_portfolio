import { getMessages, safe } from '@/lib/data';
import { MessagesList } from '@/components/admin/MessagesList';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Messages' };

export default async function AdminMessagesPage() {
  const messages = await safe(getMessages, []);
  return (
    <>
      <PageHeader title="Messages" description="Messages sent through the contact form." />
      <MessagesList messages={messages} />
    </>
  );
}
