import { Dialog, DialogContent } from '@components/atoms/Dialog/Dialog';

export default {
  component: Dialog,
};

export const Default = {
  render: () => (
    <Dialog open>
      <DialogContent>Hello World</DialogContent>
    </Dialog>
  ),
};
