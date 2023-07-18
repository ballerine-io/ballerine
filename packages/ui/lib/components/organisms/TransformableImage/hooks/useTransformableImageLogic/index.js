import { useState as p, useCallback as e, useRef as A, useLayoutEffect as S } from 'react';
const F = ({ onCrop: h, onCropDone: d, completedCrop: f }) => {
  const [l, Y] = p(0),
    [m, v] = p(!1),
    [s, y] = p({
      positionX: 0,
      positionY: 0,
      scale: 1,
    }),
    C = e(() => {
      Y(t => (t === 270 ? 0 : t + 90));
    }, []),
    r = e(t => () => v(o => (typeof t == 'boolean' ? t : !o)), []),
    u = e(() => r(!1)(), [r]),
    x = e(() => r(!0)(), [r]),
    i = e(() => {
      u(), h(void 0);
    }, [h, u]),
    E = ({
      image: t,
      canvas: o,
      crop: a,
      scale: g = 1,
      rotate: H = 0,
      positionX: U = 0,
      positionY: _ = 0,
    }) => {
      const n = o.getContext('2d'),
        W = Math.PI / 180,
        w = t.naturalWidth / t.width,
        R = t.naturalHeight / t.height,
        c = window.devicePixelRatio;
      (o.width = Math.floor(a.width * w * c)),
        (o.height = Math.floor(a.height * R * c)),
        n.scale(c, c),
        (n.imageSmoothingQuality = 'high');
      const b = a.x * w,
        M = a.y * R,
        P = H * W,
        I = t.naturalWidth / 2,
        X = t.naturalHeight / 2;
      n.save(),
        n.translate(-b, -M),
        n.translate(I, X),
        n.rotate(P),
        n.scale(g, g),
        n.translate(-I, -X),
        n.drawImage(
          t,
          0,
          0,
          t.naturalWidth,
          t.naturalHeight,
          0,
          0,
          t.naturalWidth,
          t.naturalHeight,
        ),
        n.restore();
    },
    L = e(
      t => () => {
        const o = document.createElement('canvas');
        E({
          image: t,
          canvas: o,
          crop: f,
          rotate: l,
          scale: s.scale,
          positionX: s.positionX,
          positionY: s.positionY,
        });
        const a = o.toDataURL('image/png');
        d(a), i();
      },
      [f, s.scale, s.positionX, s.positionY, l, d, i],
    ),
    T = e((t, o) => y(o), []),
    k = A(null);
  return (
    S(() => {
      const t = o => {
        o.key === 'Escape' && i();
      };
      return (
        document.addEventListener('keydown', t, !1),
        () => {
          document.removeEventListener('keydown', t, !1);
        }
      );
    }, [i]),
    {
      isCropping: m,
      toggleIsCropping: r,
      toggleIsCroppingFalse: u,
      toggleIsCroppingTrue: x,
      onCropConfirm: L,
      onTransformed: T,
      imageRef: k,
      rotate: l,
      onRotate: C,
    }
  );
};
export { F as useTransformableImageLogic };
