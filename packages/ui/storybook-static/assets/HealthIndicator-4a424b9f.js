import { j as t, c as r } from './ctw-409c05e4.js';
const a = {
    healthy: 'healthy',
    failed: 'failed',
    pending: 'pending',
    'pending-longterm': 'pending-longterm',
  },
  l = ({ healthStatus: e, size: n = 20 }) =>
    t.jsx('span', {
      style: { width: `${n}px`, height: `${n}px` },
      className: r('block', 'rounded-full', {
        'bg-green-400': e === a.healthy,
        'bg-red-400': e === a.failed,
        'bg-yellow-400': e === a.pending,
        'bg-orange-400': e === a['pending-longterm'],
      }),
    });
try {
  (l.displayName = 'HealthIndicator'),
    (l.__docgenInfo = {
      description: '',
      displayName: 'HealthIndicator',
      props: {
        healthStatus: {
          defaultValue: null,
          description: '',
          name: 'healthStatus',
          required: !0,
          type: {
            name: 'enum',
            value: [
              { value: '"healthy"' },
              { value: '"failed"' },
              { value: '"pending"' },
              { value: '"pending-longterm"' },
            ],
          },
        },
        size: {
          defaultValue: { value: '20' },
          description: '',
          name: 'size',
          required: !1,
          type: { name: 'number' },
        },
      },
    });
} catch {}
export { l as H, a as W };
//# sourceMappingURL=HealthIndicator-4a424b9f.js.map
