import { R as Nu, r as Eu } from './index-8db94870.js';
import { r as wu } from './index-8ce4a492.js';
import { g as lu } from './_commonjsHelpers-042e6b4d.js';
import { b as bu, c as Ru, d as Ou, e as _u } from './_baseIteratee-6b4700d7.js';
var su = {},
  ou = wu;
(su.createRoot = ou.createRoot), (su.hydrateRoot = ou.hydrateRoot);
var Du = new Map(),
  Pu = ({ callback: e, children: u }) => {
    let D = Eu.useRef();
    return (
      Eu.useLayoutEffect(() => {
        D.current !== e && ((D.current = e), e());
      }, [e]),
      u
    );
  },
  a0 = async (e, u) => {
    let D = await Iu(u);
    return new Promise(s => {
      D.render(Nu.createElement(Pu, { callback: () => s(null) }, e));
    });
  },
  i0 = (e, u) => {
    let D = Du.get(e);
    D && (D.unmount(), Du.delete(e));
  },
  Iu = async e => {
    let u = Du.get(e);
    return u || ((u = su.createRoot(e)), Du.set(e, u)), u;
  },
  Lu = Ou,
  ku = bu,
  Mu = Ru;
function Uu(e, u) {
  var D = {};
  return (
    (u = Mu(u)),
    ku(e, function (s, n, F) {
      Lu(D, n, u(s, n, F));
    }),
    D
  );
}
var Wu = Uu;
const Vu = lu(Wu);
var cu = {},
  X = {},
  Bu = { exports: {} };
(function () {
  function e(a) {
    if (a == null) return !1;
    switch (a.type) {
      case 'ArrayExpression':
      case 'AssignmentExpression':
      case 'BinaryExpression':
      case 'CallExpression':
      case 'ConditionalExpression':
      case 'FunctionExpression':
      case 'Identifier':
      case 'Literal':
      case 'LogicalExpression':
      case 'MemberExpression':
      case 'NewExpression':
      case 'ObjectExpression':
      case 'SequenceExpression':
      case 'ThisExpression':
      case 'UnaryExpression':
      case 'UpdateExpression':
        return !0;
    }
    return !1;
  }
  function u(a) {
    if (a == null) return !1;
    switch (a.type) {
      case 'DoWhileStatement':
      case 'ForInStatement':
      case 'ForStatement':
      case 'WhileStatement':
        return !0;
    }
    return !1;
  }
  function D(a) {
    if (a == null) return !1;
    switch (a.type) {
      case 'BlockStatement':
      case 'BreakStatement':
      case 'ContinueStatement':
      case 'DebuggerStatement':
      case 'DoWhileStatement':
      case 'EmptyStatement':
      case 'ExpressionStatement':
      case 'ForInStatement':
      case 'ForStatement':
      case 'IfStatement':
      case 'LabeledStatement':
      case 'ReturnStatement':
      case 'SwitchStatement':
      case 'ThrowStatement':
      case 'TryStatement':
      case 'VariableDeclaration':
      case 'WhileStatement':
      case 'WithStatement':
        return !0;
    }
    return !1;
  }
  function s(a) {
    return D(a) || (a != null && a.type === 'FunctionDeclaration');
  }
  function n(a) {
    switch (a.type) {
      case 'IfStatement':
        return a.alternate != null ? a.alternate : a.consequent;
      case 'LabeledStatement':
      case 'ForStatement':
      case 'ForInStatement':
      case 'WhileStatement':
      case 'WithStatement':
        return a.body;
    }
    return null;
  }
  function F(a) {
    var f;
    if (a.type !== 'IfStatement' || a.alternate == null) return !1;
    f = a.consequent;
    do {
      if (f.type === 'IfStatement' && f.alternate == null) return !0;
      f = n(f);
    } while (f);
    return !1;
  }
  Bu.exports = {
    isExpression: e,
    isStatement: D,
    isIterationStatement: u,
    isSourceElement: s,
    isProblematicIfStatement: F,
    trailingStatement: n,
  };
})();
var ju = Bu.exports,
  pu = { exports: {} };
(function () {
  var e, u, D, s, n, F;
  (u = {
    NonAsciiIdentifierStart:
      /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    NonAsciiIdentifierPart:
      /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  }),
    (e = {
      NonAsciiIdentifierStart:
        /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
      NonAsciiIdentifierPart:
        /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/,
    });
  function a(p) {
    return 48 <= p && p <= 57;
  }
  function f(p) {
    return (48 <= p && p <= 57) || (97 <= p && p <= 102) || (65 <= p && p <= 70);
  }
  function g(p) {
    return p >= 48 && p <= 55;
  }
  D = [
    5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288,
    65279,
  ];
  function y(p) {
    return (
      p === 32 || p === 9 || p === 11 || p === 12 || p === 160 || (p >= 5760 && D.indexOf(p) >= 0)
    );
  }
  function I(p) {
    return p === 10 || p === 13 || p === 8232 || p === 8233;
  }
  function _(p) {
    if (p <= 65535) return String.fromCharCode(p);
    var W = String.fromCharCode(Math.floor((p - 65536) / 1024) + 55296),
      j = String.fromCharCode(((p - 65536) % 1024) + 56320);
    return W + j;
  }
  for (s = new Array(128), F = 0; F < 128; ++F)
    s[F] = (F >= 97 && F <= 122) || (F >= 65 && F <= 90) || F === 36 || F === 95;
  for (n = new Array(128), F = 0; F < 128; ++F)
    n[F] =
      (F >= 97 && F <= 122) || (F >= 65 && F <= 90) || (F >= 48 && F <= 57) || F === 36 || F === 95;
  function E(p) {
    return p < 128 ? s[p] : u.NonAsciiIdentifierStart.test(_(p));
  }
  function x(p) {
    return p < 128 ? n[p] : u.NonAsciiIdentifierPart.test(_(p));
  }
  function m(p) {
    return p < 128 ? s[p] : e.NonAsciiIdentifierStart.test(_(p));
  }
  function c(p) {
    return p < 128 ? n[p] : e.NonAsciiIdentifierPart.test(_(p));
  }
  pu.exports = {
    isDecimalDigit: a,
    isHexDigit: f,
    isOctalDigit: g,
    isWhiteSpace: y,
    isLineTerminator: I,
    isIdentifierStartES5: E,
    isIdentifierPartES5: x,
    isIdentifierStartES6: m,
    isIdentifierPartES6: c,
  };
})();
var fu = pu.exports,
  hu = { exports: {} };
(function () {
  var e = fu;
  function u(E) {
    switch (E) {
      case 'implements':
      case 'interface':
      case 'package':
      case 'private':
      case 'protected':
      case 'public':
      case 'static':
      case 'let':
        return !0;
      default:
        return !1;
    }
  }
  function D(E, x) {
    return !x && E === 'yield' ? !1 : s(E, x);
  }
  function s(E, x) {
    if (x && u(E)) return !0;
    switch (E.length) {
      case 2:
        return E === 'if' || E === 'in' || E === 'do';
      case 3:
        return E === 'var' || E === 'for' || E === 'new' || E === 'try';
      case 4:
        return (
          E === 'this' ||
          E === 'else' ||
          E === 'case' ||
          E === 'void' ||
          E === 'with' ||
          E === 'enum'
        );
      case 5:
        return (
          E === 'while' ||
          E === 'break' ||
          E === 'catch' ||
          E === 'throw' ||
          E === 'const' ||
          E === 'yield' ||
          E === 'class' ||
          E === 'super'
        );
      case 6:
        return (
          E === 'return' ||
          E === 'typeof' ||
          E === 'delete' ||
          E === 'switch' ||
          E === 'export' ||
          E === 'import'
        );
      case 7:
        return E === 'default' || E === 'finally' || E === 'extends';
      case 8:
        return E === 'function' || E === 'continue' || E === 'debugger';
      case 10:
        return E === 'instanceof';
      default:
        return !1;
    }
  }
  function n(E, x) {
    return E === 'null' || E === 'true' || E === 'false' || D(E, x);
  }
  function F(E, x) {
    return E === 'null' || E === 'true' || E === 'false' || s(E, x);
  }
  function a(E) {
    return E === 'eval' || E === 'arguments';
  }
  function f(E) {
    var x, m, c;
    if (E.length === 0 || ((c = E.charCodeAt(0)), !e.isIdentifierStartES5(c))) return !1;
    for (x = 1, m = E.length; x < m; ++x)
      if (((c = E.charCodeAt(x)), !e.isIdentifierPartES5(c))) return !1;
    return !0;
  }
  function g(E, x) {
    return (E - 55296) * 1024 + (x - 56320) + 65536;
  }
  function y(E) {
    var x, m, c, p, W;
    if (E.length === 0) return !1;
    for (W = e.isIdentifierStartES6, x = 0, m = E.length; x < m; ++x) {
      if (((c = E.charCodeAt(x)), 55296 <= c && c <= 56319)) {
        if ((++x, x >= m || ((p = E.charCodeAt(x)), !(56320 <= p && p <= 57343)))) return !1;
        c = g(c, p);
      }
      if (!W(c)) return !1;
      W = e.isIdentifierPartES6;
    }
    return !0;
  }
  function I(E, x) {
    return f(E) && !n(E, x);
  }
  function _(E, x) {
    return y(E) && !F(E, x);
  }
  hu.exports = {
    isKeywordES5: D,
    isKeywordES6: s,
    isReservedWordES5: n,
    isReservedWordES6: F,
    isRestrictedWord: a,
    isIdentifierNameES5: f,
    isIdentifierNameES6: y,
    isIdentifierES5: I,
    isIdentifierES6: _,
  };
})();
var $u = hu.exports;
(function () {
  (X.ast = ju), (X.code = fu), (X.keyword = $u);
})();
var H = {},
  J = {};
const Ku = 'doctrine',
  Gu = 'JSDoc parser',
  Ju = 'https://github.com/eslint/doctrine',
  Qu = 'lib/doctrine.js',
  qu = '3.0.0',
  zu = { node: '>=6.0.0' },
  Hu = { lib: './lib' },
  Yu = ['lib'],
  Xu = [
    {
      name: 'Nicholas C. Zakas',
      email: 'nicholas+npm@nczconsulting.com',
      web: 'https://www.nczonline.net',
    },
    {
      name: 'Yusuke Suzuki',
      email: 'utatane.tea@gmail.com',
      web: 'https://github.com/Constellation',
    },
  ],
  Zu = 'eslint/doctrine',
  ue = {
    coveralls: '^3.0.1',
    dateformat: '^1.0.11',
    eslint: '^1.10.3',
    'eslint-release': '^1.0.0',
    linefix: '^0.1.1',
    mocha: '^3.4.2',
    'npm-license': '^0.3.1',
    nyc: '^10.3.2',
    semver: '^5.0.3',
    shelljs: '^0.5.3',
    'shelljs-nodecli': '^0.1.1',
    should: '^5.0.1',
  },
  ee = 'Apache-2.0',
  re = {
    pretest: 'npm run lint',
    test: 'nyc mocha',
    coveralls: 'nyc report --reporter=text-lcov | coveralls',
    lint: 'eslint lib/',
    'generate-release': 'eslint-generate-release',
    'generate-alpharelease': 'eslint-generate-prerelease alpha',
    'generate-betarelease': 'eslint-generate-prerelease beta',
    'generate-rcrelease': 'eslint-generate-prerelease rc',
    'publish-release': 'eslint-publish-release',
  },
  te = { esutils: '^2.0.2' },
  De = {
    name: Ku,
    description: Gu,
    homepage: Ju,
    main: Qu,
    version: qu,
    engines: zu,
    directories: Hu,
    files: Yu,
    maintainers: Xu,
    repository: Zu,
    devDependencies: ue,
    license: ee,
    scripts: re,
    dependencies: te,
  };
function ne(e, u) {
  if (!e) throw new Error(u || 'unknown assertion error');
}
var ae = ne;
(function () {
  var e;
  (e = De.version), (J.VERSION = e);
  function u(s) {
    (this.name = 'DoctrineError'), (this.message = s);
  }
  (u.prototype = (function () {
    var s = function () {};
    return (s.prototype = Error.prototype), new s();
  })()),
    (u.prototype.constructor = u),
    (J.DoctrineError = u);
  function D(s) {
    throw new u(s);
  }
  (J.throwError = D), (J.assert = ae);
})();
(function () {
  var e, u, D, s, n, F, a, f, g, y, I, _;
  (g = X),
    (y = J),
    (e = {
      NullableLiteral: 'NullableLiteral',
      AllLiteral: 'AllLiteral',
      NullLiteral: 'NullLiteral',
      UndefinedLiteral: 'UndefinedLiteral',
      VoidLiteral: 'VoidLiteral',
      UnionType: 'UnionType',
      ArrayType: 'ArrayType',
      RecordType: 'RecordType',
      FieldType: 'FieldType',
      FunctionType: 'FunctionType',
      ParameterType: 'ParameterType',
      RestType: 'RestType',
      NonNullableType: 'NonNullableType',
      OptionalType: 'OptionalType',
      NullableType: 'NullableType',
      NameExpression: 'NameExpression',
      TypeApplication: 'TypeApplication',
      StringLiteralType: 'StringLiteralType',
      NumericLiteralType: 'NumericLiteralType',
      BooleanLiteralType: 'BooleanLiteralType',
    }),
    (u = {
      ILLEGAL: 0,
      DOT_LT: 1,
      REST: 2,
      LT: 3,
      GT: 4,
      LPAREN: 5,
      RPAREN: 6,
      LBRACE: 7,
      RBRACE: 8,
      LBRACK: 9,
      RBRACK: 10,
      COMMA: 11,
      COLON: 12,
      STAR: 13,
      PIPE: 14,
      QUESTION: 15,
      BANG: 16,
      EQUAL: 17,
      NAME: 18,
      STRING: 19,
      NUMBER: 20,
      EOF: 21,
    });
  function E(r) {
    return (
      '><(){}[],:*|?!='.indexOf(String.fromCharCode(r)) === -1 &&
      !g.code.isWhiteSpace(r) &&
      !g.code.isLineTerminator(r)
    );
  }
  function x(r, t, B, A) {
    (this._previous = r), (this._index = t), (this._token = B), (this._value = A);
  }
  (x.prototype.restore = function () {
    (F = this._previous), (n = this._index), (a = this._token), (f = this._value);
  }),
    (x.save = function () {
      return new x(F, n, a, f);
    });
  function m(r, t) {
    return _ && (r.range = [t[0] + I, t[1] + I]), r;
  }
  function c() {
    var r = D.charAt(n);
    return (n += 1), r;
  }
  function p(r) {
    var t,
      B,
      A,
      i = 0;
    for (B = r === 'u' ? 4 : 2, t = 0; t < B; ++t)
      if (n < s && g.code.isHexDigit(D.charCodeAt(n)))
        (A = c()), (i = i * 16 + '0123456789abcdef'.indexOf(A.toLowerCase()));
      else return '';
    return String.fromCharCode(i);
  }
  function W() {
    var r = '',
      t,
      B,
      A,
      i,
      l;
    for (t = D.charAt(n), ++n; n < s; )
      if (((B = c()), B === t)) {
        t = '';
        break;
      } else if (B === '\\')
        if (((B = c()), g.code.isLineTerminator(B.charCodeAt(0))))
          B === '\r' && D.charCodeAt(n) === 10 && ++n;
        else
          switch (B) {
            case 'n':
              r += `
`;
              break;
            case 'r':
              r += '\r';
              break;
            case 't':
              r += '	';
              break;
            case 'u':
            case 'x':
              (l = n), (i = p(B)), i ? (r += i) : ((n = l), (r += B));
              break;
            case 'b':
              r += '\b';
              break;
            case 'f':
              r += '\f';
              break;
            case 'v':
              r += '\v';
              break;
            default:
              g.code.isOctalDigit(B.charCodeAt(0))
                ? ((A = '01234567'.indexOf(B)),
                  n < s &&
                    g.code.isOctalDigit(D.charCodeAt(n)) &&
                    ((A = A * 8 + '01234567'.indexOf(c())),
                    '0123'.indexOf(B) >= 0 &&
                      n < s &&
                      g.code.isOctalDigit(D.charCodeAt(n)) &&
                      (A = A * 8 + '01234567'.indexOf(c()))),
                  (r += String.fromCharCode(A)))
                : (r += B);
              break;
          }
      else {
        if (g.code.isLineTerminator(B.charCodeAt(0))) break;
        r += B;
      }
    return t !== '' && y.throwError('unexpected quote'), (f = r), u.STRING;
  }
  function j() {
    var r, t;
    if (((r = ''), (t = D.charCodeAt(n)), t !== 46)) {
      if (((r = c()), (t = D.charCodeAt(n)), r === '0')) {
        if (t === 120 || t === 88) {
          for (r += c(); n < s && ((t = D.charCodeAt(n)), !!g.code.isHexDigit(t)); ) r += c();
          return (
            r.length <= 2 && y.throwError('unexpected token'),
            n < s &&
              ((t = D.charCodeAt(n)),
              g.code.isIdentifierStartES5(t) && y.throwError('unexpected token')),
            (f = parseInt(r, 16)),
            u.NUMBER
          );
        }
        if (g.code.isOctalDigit(t)) {
          for (r += c(); n < s && ((t = D.charCodeAt(n)), !!g.code.isOctalDigit(t)); ) r += c();
          return (
            n < s &&
              ((t = D.charCodeAt(n)),
              (g.code.isIdentifierStartES5(t) || g.code.isDecimalDigit(t)) &&
                y.throwError('unexpected token')),
            (f = parseInt(r, 8)),
            u.NUMBER
          );
        }
        g.code.isDecimalDigit(t) && y.throwError('unexpected token');
      }
      for (; n < s && ((t = D.charCodeAt(n)), !!g.code.isDecimalDigit(t)); ) r += c();
    }
    if (t === 46)
      for (r += c(); n < s && ((t = D.charCodeAt(n)), !!g.code.isDecimalDigit(t)); ) r += c();
    if (t === 101 || t === 69)
      if (
        ((r += c()),
        (t = D.charCodeAt(n)),
        (t === 43 || t === 45) && (r += c()),
        (t = D.charCodeAt(n)),
        g.code.isDecimalDigit(t))
      )
        for (r += c(); n < s && ((t = D.charCodeAt(n)), !!g.code.isDecimalDigit(t)); ) r += c();
      else y.throwError('unexpected token');
    return (
      n < s &&
        ((t = D.charCodeAt(n)), g.code.isIdentifierStartES5(t) && y.throwError('unexpected token')),
      (f = parseFloat(r)),
      u.NUMBER
    );
  }
  function uu() {
    var r, t;
    for (f = c(); n < s && E(D.charCodeAt(n)); ) {
      if (((r = D.charCodeAt(n)), r === 46)) {
        if (n + 1 >= s) return u.ILLEGAL;
        if (((t = D.charCodeAt(n + 1)), t === 60)) break;
      }
      f += c();
    }
    return u.NAME;
  }
  function k() {
    var r;
    for (F = n; n < s && g.code.isWhiteSpace(D.charCodeAt(n)); ) c();
    if (n >= s) return (a = u.EOF), a;
    switch (((r = D.charCodeAt(n)), r)) {
      case 39:
      case 34:
        return (a = W()), a;
      case 58:
        return c(), (a = u.COLON), a;
      case 44:
        return c(), (a = u.COMMA), a;
      case 40:
        return c(), (a = u.LPAREN), a;
      case 41:
        return c(), (a = u.RPAREN), a;
      case 91:
        return c(), (a = u.LBRACK), a;
      case 93:
        return c(), (a = u.RBRACK), a;
      case 123:
        return c(), (a = u.LBRACE), a;
      case 125:
        return c(), (a = u.RBRACE), a;
      case 46:
        if (n + 1 < s) {
          if (((r = D.charCodeAt(n + 1)), r === 60)) return c(), c(), (a = u.DOT_LT), a;
          if (r === 46 && n + 2 < s && D.charCodeAt(n + 2) === 46)
            return c(), c(), c(), (a = u.REST), a;
          if (g.code.isDecimalDigit(r)) return (a = j()), a;
        }
        return (a = u.ILLEGAL), a;
      case 60:
        return c(), (a = u.LT), a;
      case 62:
        return c(), (a = u.GT), a;
      case 42:
        return c(), (a = u.STAR), a;
      case 124:
        return c(), (a = u.PIPE), a;
      case 63:
        return c(), (a = u.QUESTION), a;
      case 33:
        return c(), (a = u.BANG), a;
      case 61:
        return c(), (a = u.EQUAL), a;
      case 45:
        return (a = j()), a;
      default:
        return g.code.isDecimalDigit(r) ? ((a = j()), a) : (y.assert(E(r)), (a = uu()), a);
    }
  }
  function T(r, t) {
    y.assert(a === r, t || 'consumed token not matched'), k();
  }
  function C(r, t) {
    a !== r && y.throwError(t || 'unexpected token'), k();
  }
  function P() {
    var r,
      t = n - 1;
    if ((T(u.LPAREN, 'UnionType should start with ('), (r = []), a !== u.RPAREN))
      for (; r.push(L()), a !== u.RPAREN; ) C(u.PIPE);
    return (
      T(u.RPAREN, 'UnionType should end with )'), m({ type: e.UnionType, elements: r }, [t, F])
    );
  }
  function o() {
    var r,
      t = n - 1,
      B;
    for (T(u.LBRACK, 'ArrayType should start with ['), r = []; a !== u.RBRACK; ) {
      if (a === u.REST) {
        (B = n - 3), T(u.REST), r.push(m({ type: e.RestType, expression: L() }, [B, F]));
        break;
      } else r.push(L());
      a !== u.RBRACK && C(u.COMMA);
    }
    return C(u.RBRACK), m({ type: e.ArrayType, elements: r }, [t, F]);
  }
  function M() {
    var r = f;
    if (a === u.NAME || a === u.STRING) return k(), r;
    if (a === u.NUMBER) return T(u.NUMBER), String(r);
    y.throwError('unexpected token');
  }
  function U() {
    var r,
      t = F;
    return (
      (r = M()),
      a === u.COLON
        ? (T(u.COLON), m({ type: e.FieldType, key: r, value: L() }, [t, F]))
        : m({ type: e.FieldType, key: r, value: null }, [t, F])
    );
  }
  function d() {
    var r,
      t = n - 1,
      B;
    if ((T(u.LBRACE, 'RecordType should start with {'), (r = []), a === u.COMMA)) T(u.COMMA);
    else for (; a !== u.RBRACE; ) r.push(U()), a !== u.RBRACE && C(u.COMMA);
    return (B = n), C(u.RBRACE), m({ type: e.RecordType, fields: r }, [t, B]);
  }
  function q() {
    var r = f,
      t = n - r.length;
    return (
      C(u.NAME),
      a === u.COLON &&
        (r === 'module' || r === 'external' || r === 'event') &&
        (T(u.COLON), (r += ':' + f), C(u.NAME)),
      m({ type: e.NameExpression, name: r }, [t, F])
    );
  }
  function eu() {
    var r = [];
    for (r.push(V()); a === u.COMMA; ) T(u.COMMA), r.push(V());
    return r;
  }
  function K() {
    var r,
      t,
      B = n - f.length;
    return (
      (r = q()),
      a === u.DOT_LT || a === u.LT
        ? (k(),
          (t = eu()),
          C(u.GT),
          m({ type: e.TypeApplication, expression: r, applications: t }, [B, F]))
        : r
    );
  }
  function ru() {
    return (
      T(u.COLON, 'ResultType should start with :'),
      a === u.NAME && f === 'void' ? (T(u.NAME), { type: e.VoidLiteral }) : L()
    );
  }
  function S() {
    for (var r = [], t = !1, B, A = !1, i, l = n - 3, h; a !== u.RPAREN; )
      a === u.REST && (T(u.REST), (A = !0)),
        (i = F),
        (B = L()),
        B.type === e.NameExpression &&
          a === u.COLON &&
          ((h = F - B.name.length),
          T(u.COLON),
          (B = m({ type: e.ParameterType, name: B.name, expression: L() }, [h, F]))),
        a === u.EQUAL
          ? (T(u.EQUAL), (B = m({ type: e.OptionalType, expression: B }, [i, F])), (t = !0))
          : t && y.throwError('unexpected token'),
        A && (B = m({ type: e.RestType, expression: B }, [l, F])),
        r.push(B),
        a !== u.RPAREN && C(u.COMMA);
    return r;
  }
  function iu() {
    var r,
      t,
      B,
      A,
      i,
      l = n - f.length;
    return (
      y.assert(a === u.NAME && f === 'function', "FunctionType should start with 'function'"),
      T(u.NAME),
      C(u.LPAREN),
      (r = !1),
      (B = []),
      (t = null),
      a !== u.RPAREN &&
        (a === u.NAME && (f === 'this' || f === 'new')
          ? ((r = f === 'new'),
            T(u.NAME),
            C(u.COLON),
            (t = K()),
            a === u.COMMA && (T(u.COMMA), (B = S())))
          : (B = S())),
      C(u.RPAREN),
      (A = null),
      a === u.COLON && (A = ru()),
      (i = m({ type: e.FunctionType, params: B, result: A }, [l, F])),
      t && ((i.this = t), r && (i.new = !0)),
      i
    );
  }
  function z() {
    var r, t;
    switch (a) {
      case u.STAR:
        return T(u.STAR), m({ type: e.AllLiteral }, [F - 1, F]);
      case u.LPAREN:
        return P();
      case u.LBRACK:
        return o();
      case u.LBRACE:
        return d();
      case u.NAME:
        if (((t = n - f.length), f === 'null'))
          return T(u.NAME), m({ type: e.NullLiteral }, [t, F]);
        if (f === 'undefined') return T(u.NAME), m({ type: e.UndefinedLiteral }, [t, F]);
        if (f === 'true' || f === 'false')
          return T(u.NAME), m({ type: e.BooleanLiteralType, value: f === 'true' }, [t, F]);
        if (((r = x.save()), f === 'function'))
          try {
            return iu();
          } catch {
            r.restore();
          }
        return K();
      case u.STRING:
        return k(), m({ type: e.StringLiteralType, value: f }, [F - f.length - 2, F]);
      case u.NUMBER:
        return k(), m({ type: e.NumericLiteralType, value: f }, [F - String(f).length, F]);
      default:
        y.throwError('unexpected token');
    }
  }
  function L() {
    var r, t;
    return a === u.QUESTION
      ? ((t = n - 1),
        T(u.QUESTION),
        a === u.COMMA ||
        a === u.EQUAL ||
        a === u.RBRACE ||
        a === u.RPAREN ||
        a === u.PIPE ||
        a === u.EOF ||
        a === u.RBRACK ||
        a === u.GT
          ? m({ type: e.NullableLiteral }, [t, F])
          : m({ type: e.NullableType, expression: z(), prefix: !0 }, [t, F]))
      : a === u.BANG
      ? ((t = n - 1),
        T(u.BANG),
        m({ type: e.NonNullableType, expression: z(), prefix: !0 }, [t, F]))
      : ((t = F),
        (r = z()),
        a === u.BANG
          ? (T(u.BANG), m({ type: e.NonNullableType, expression: r, prefix: !1 }, [t, F]))
          : a === u.QUESTION
          ? (T(u.QUESTION), m({ type: e.NullableType, expression: r, prefix: !1 }, [t, F]))
          : a === u.LBRACK
          ? (T(u.LBRACK),
            C(u.RBRACK, 'expected an array-style type declaration (' + f + '[])'),
            m(
              {
                type: e.TypeApplication,
                expression: m({ type: e.NameExpression, name: 'Array' }, [t, F]),
                applications: [r],
              },
              [t, F],
            ))
          : r);
  }
  function V() {
    var r, t;
    if (((r = L()), a !== u.PIPE)) return r;
    for (t = [r], T(u.PIPE); t.push(L()), a === u.PIPE; ) T(u.PIPE);
    return m({ type: e.UnionType, elements: t }, [0, n]);
  }
  function G() {
    var r;
    return a === u.REST
      ? (T(u.REST), m({ type: e.RestType, expression: V() }, [0, n]))
      : ((r = V()),
        a === u.EQUAL ? (T(u.EQUAL), m({ type: e.OptionalType, expression: r }, [0, n])) : r);
  }
  function tu(r, t) {
    var B;
    return (
      (D = r),
      (s = D.length),
      (n = 0),
      (F = 0),
      (_ = t && t.range),
      (I = (t && t.startIndex) || 0),
      k(),
      (B = V()),
      t && t.midstream
        ? { expression: B, index: F }
        : (a !== u.EOF && y.throwError('not reach to EOF'), B)
    );
  }
  function Au(r, t) {
    var B;
    return (
      (D = r),
      (s = D.length),
      (n = 0),
      (F = 0),
      (_ = t && t.range),
      (I = (t && t.startIndex) || 0),
      k(),
      (B = G()),
      t && t.midstream
        ? { expression: B, index: F }
        : (a !== u.EOF && y.throwError('not reach to EOF'), B)
    );
  }
  function N(r, t, B) {
    var A, i, l;
    switch (r.type) {
      case e.NullableLiteral:
        A = '?';
        break;
      case e.AllLiteral:
        A = '*';
        break;
      case e.NullLiteral:
        A = 'null';
        break;
      case e.UndefinedLiteral:
        A = 'undefined';
        break;
      case e.VoidLiteral:
        A = 'void';
        break;
      case e.UnionType:
        for (B ? (A = '') : (A = '('), i = 0, l = r.elements.length; i < l; ++i)
          (A += N(r.elements[i], t)), i + 1 !== l && (A += t ? '|' : ' | ');
        B || (A += ')');
        break;
      case e.ArrayType:
        for (A = '[', i = 0, l = r.elements.length; i < l; ++i)
          (A += N(r.elements[i], t)), i + 1 !== l && (A += t ? ',' : ', ');
        A += ']';
        break;
      case e.RecordType:
        for (A = '{', i = 0, l = r.fields.length; i < l; ++i)
          (A += N(r.fields[i], t)), i + 1 !== l && (A += t ? ',' : ', ');
        A += '}';
        break;
      case e.FieldType:
        r.value ? (A = r.key + (t ? ':' : ': ') + N(r.value, t)) : (A = r.key);
        break;
      case e.FunctionType:
        for (
          A = t ? 'function(' : 'function (',
            r.this &&
              (r.new ? (A += t ? 'new:' : 'new: ') : (A += t ? 'this:' : 'this: '),
              (A += N(r.this, t)),
              r.params.length !== 0 && (A += t ? ',' : ', ')),
            i = 0,
            l = r.params.length;
          i < l;
          ++i
        )
          (A += N(r.params[i], t)), i + 1 !== l && (A += t ? ',' : ', ');
        (A += ')'), r.result && (A += (t ? ':' : ': ') + N(r.result, t));
        break;
      case e.ParameterType:
        A = r.name + (t ? ':' : ': ') + N(r.expression, t);
        break;
      case e.RestType:
        (A = '...'), r.expression && (A += N(r.expression, t));
        break;
      case e.NonNullableType:
        r.prefix ? (A = '!' + N(r.expression, t)) : (A = N(r.expression, t) + '!');
        break;
      case e.OptionalType:
        A = N(r.expression, t) + '=';
        break;
      case e.NullableType:
        r.prefix ? (A = '?' + N(r.expression, t)) : (A = N(r.expression, t) + '?');
        break;
      case e.NameExpression:
        A = r.name;
        break;
      case e.TypeApplication:
        for (A = N(r.expression, t) + '.<', i = 0, l = r.applications.length; i < l; ++i)
          (A += N(r.applications[i], t)), i + 1 !== l && (A += t ? ',' : ', ');
        A += '>';
        break;
      case e.StringLiteralType:
        A = '"' + r.value + '"';
        break;
      case e.NumericLiteralType:
        A = String(r.value);
        break;
      case e.BooleanLiteralType:
        A = String(r.value);
        break;
      default:
        y.throwError('Unknown type ' + r.type);
    }
    return A;
  }
  function b(r, t) {
    return t == null && (t = {}), N(r, t.compact, t.topLevel);
  }
  (H.parseType = tu), (H.parseParamType = Au), (H.stringify = b), (H.Syntax = e);
})();
(function (e) {
  (function () {
    var u, D, s, n, F;
    (n = X), (u = H), (D = J);
    function a(C, P, o) {
      return C.slice(P, o);
    }
    F = (function () {
      var C = Object.prototype.hasOwnProperty;
      return function (o, M) {
        return C.call(o, M);
      };
    })();
    function f(C) {
      var P = {},
        o;
      for (o in C) C.hasOwnProperty(o) && (P[o] = C[o]);
      return P;
    }
    function g(C) {
      return (C >= 97 && C <= 122) || (C >= 65 && C <= 90) || (C >= 48 && C <= 57);
    }
    function y(C) {
      return C === 'param' || C === 'argument' || C === 'arg';
    }
    function I(C) {
      return C === 'return' || C === 'returns';
    }
    function _(C) {
      return C === 'property' || C === 'prop';
    }
    function E(C) {
      return y(C) || _(C) || C === 'alias' || C === 'this' || C === 'mixes' || C === 'requires';
    }
    function x(C) {
      return E(C) || C === 'const' || C === 'constant';
    }
    function m(C) {
      return _(C) || y(C);
    }
    function c(C) {
      return _(C) || y(C);
    }
    function p(C) {
      return (
        y(C) ||
        I(C) ||
        C === 'define' ||
        C === 'enum' ||
        C === 'implements' ||
        C === 'this' ||
        C === 'type' ||
        C === 'typedef' ||
        _(C)
      );
    }
    function W(C) {
      return (
        p(C) ||
        C === 'throws' ||
        C === 'const' ||
        C === 'constant' ||
        C === 'namespace' ||
        C === 'member' ||
        C === 'var' ||
        C === 'module' ||
        C === 'constructor' ||
        C === 'class' ||
        C === 'extends' ||
        C === 'augments' ||
        C === 'public' ||
        C === 'private' ||
        C === 'protected'
      );
    }
    var j = '[ \\f\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]',
      uu =
        '(' +
        j +
        '*(?:\\*' +
        j +
        `?)?)(.+|[\r
\u2028\u2029])`;
    function k(C) {
      return C.replace(/^\/\*\*?/, '')
        .replace(/\*\/$/, '')
        .replace(new RegExp(uu, 'g'), '$2')
        .replace(/\s*$/, '');
    }
    function T(C, P) {
      for (var o = C.replace(/^\/\*\*?/, ''), M = 0, U = new RegExp(uu, 'g'), d; (d = U.exec(o)); )
        if (((M += d[1].length), d.index + d[0].length > P + M)) return P + M + C.length - o.length;
      return C.replace(/\*\/$/, '').replace(/\s*$/, '').length;
    }
    (function (C) {
      var P, o, M, U, d, q, eu, K, ru;
      function S() {
        var A = d.charCodeAt(o);
        return (
          (o += 1),
          n.code.isLineTerminator(A) && !(A === 13 && d.charCodeAt(o) === 10) && (M += 1),
          String.fromCharCode(A)
        );
      }
      function iu() {
        var A = '';
        for (S(); o < U && g(d.charCodeAt(o)); ) A += S();
        return A;
      }
      function z() {
        var A,
          i,
          l = o;
        for (i = !1; l < U; ) {
          if (
            ((A = d.charCodeAt(l)),
            n.code.isLineTerminator(A) && !(A === 13 && d.charCodeAt(l + 1) === 10))
          )
            i = !0;
          else if (i) {
            if (A === 64) break;
            n.code.isWhiteSpace(A) || (i = !1);
          }
          l += 1;
        }
        return l;
      }
      function L(A, i, l) {
        for (var h, R, v, O, $ = !1; o < i; )
          if (((h = d.charCodeAt(o)), n.code.isWhiteSpace(h))) S();
          else if (h === 123) {
            S();
            break;
          } else {
            $ = !0;
            break;
          }
        if ($) return null;
        for (R = 1, v = ''; o < i; )
          if (((h = d.charCodeAt(o)), n.code.isLineTerminator(h))) S();
          else {
            if (h === 125) {
              if (((R -= 1), R === 0)) {
                S();
                break;
              }
            } else h === 123 && (R += 1);
            v === '' && (O = o), (v += S());
          }
        return R !== 0
          ? D.throwError('Braces are not balanced')
          : c(A)
          ? u.parseParamType(v, { startIndex: N(O), range: l })
          : u.parseType(v, { startIndex: N(O), range: l });
      }
      function V(A) {
        var i;
        if (!n.code.isIdentifierStartES5(d.charCodeAt(o)) && !d[o].match(/[0-9]/)) return null;
        for (i = S(); o < A && n.code.isIdentifierPartES5(d.charCodeAt(o)); ) i += S();
        return i;
      }
      function G(A) {
        for (
          ;
          o < A &&
          (n.code.isWhiteSpace(d.charCodeAt(o)) || n.code.isLineTerminator(d.charCodeAt(o)));

        )
          S();
      }
      function tu(A, i, l) {
        var h = '',
          R,
          v;
        if ((G(A), o >= A)) return null;
        if (d.charCodeAt(o) === 91)
          if (i) (R = !0), (h = S());
          else return null;
        if (((h += V(A)), l))
          for (
            d.charCodeAt(o) === 58 &&
              (h === 'module' || h === 'external' || h === 'event') &&
              ((h += S()), (h += V(A))),
              d.charCodeAt(o) === 91 && d.charCodeAt(o + 1) === 93 && ((h += S()), (h += S()));
            d.charCodeAt(o) === 46 ||
            d.charCodeAt(o) === 47 ||
            d.charCodeAt(o) === 35 ||
            d.charCodeAt(o) === 45 ||
            d.charCodeAt(o) === 126;

          )
            (h += S()), (h += V(A));
        if (R) {
          if ((G(A), d.charCodeAt(o) === 61)) {
            (h += S()), G(A);
            for (var O, $ = 1; o < A; ) {
              if (
                ((O = d.charCodeAt(o)),
                n.code.isWhiteSpace(O) && (v || (G(A), (O = d.charCodeAt(o)))),
                O === 39 && (v ? v === "'" && (v = '') : (v = "'")),
                O === 34 && (v ? v === '"' && (v = '') : (v = '"')),
                O === 91)
              )
                $++;
              else if (O === 93 && --$ === 0) break;
              h += S();
            }
          }
          if ((G(A), o >= A || d.charCodeAt(o) !== 93)) return null;
          h += S();
        }
        return h;
      }
      function Au() {
        for (; o < U && d.charCodeAt(o) !== 64; ) S();
        return o >= U ? !1 : (D.assert(d.charCodeAt(o) === 64), !0);
      }
      function N(A) {
        return d === q ? A : T(q, A);
      }
      function b(A, i) {
        (this._options = A),
          (this._title = i.toLowerCase()),
          (this._tag = { title: i, description: null }),
          this._options.lineNumbers && (this._tag.lineNumber = M),
          (this._first = o - i.length - 1),
          (this._last = 0),
          (this._extra = {});
      }
      (b.prototype.addError = function (i) {
        var l = Array.prototype.slice.call(arguments, 1),
          h = i.replace(/%(\d)/g, function (R, v) {
            return D.assert(v < l.length, 'Message reference must be in range'), l[v];
          });
        return (
          this._tag.errors || (this._tag.errors = []),
          ru && D.throwError(h),
          this._tag.errors.push(h),
          eu
        );
      }),
        (b.prototype.parseType = function () {
          if (p(this._title))
            try {
              if (
                ((this._tag.type = L(this._title, this._last, this._options.range)),
                !this._tag.type &&
                  !y(this._title) &&
                  !I(this._title) &&
                  !this.addError('Missing or invalid tag type'))
              )
                return !1;
            } catch (A) {
              if (((this._tag.type = null), !this.addError(A.message))) return !1;
            }
          else if (W(this._title))
            try {
              this._tag.type = L(this._title, this._last, this._options.range);
            } catch {}
          return !0;
        }),
        (b.prototype._parseNamePath = function (A) {
          var i;
          return (
            (i = tu(this._last, K && c(this._title), !0)),
            !i && !A && !this.addError('Missing or invalid tag name')
              ? !1
              : ((this._tag.name = i), !0)
          );
        }),
        (b.prototype.parseNamePath = function () {
          return this._parseNamePath(!1);
        }),
        (b.prototype.parseNamePathOptional = function () {
          return this._parseNamePath(!0);
        }),
        (b.prototype.parseName = function () {
          var A, i;
          if (x(this._title))
            if (
              ((this._tag.name = tu(this._last, K && c(this._title), m(this._title))),
              this._tag.name)
            )
              (i = this._tag.name),
                i.charAt(0) === '[' &&
                  i.charAt(i.length - 1) === ']' &&
                  ((A = i.substring(1, i.length - 1).split('=')),
                  A.length > 1 && (this._tag.default = A.slice(1).join('=')),
                  (this._tag.name = A[0]),
                  this._tag.type &&
                    this._tag.type.type !== 'OptionalType' &&
                    (this._tag.type = { type: 'OptionalType', expression: this._tag.type }));
            else {
              if (!E(this._title)) return !0;
              if (y(this._title) && this._tag.type && this._tag.type.name)
                (this._extra.name = this._tag.type),
                  (this._tag.name = this._tag.type.name),
                  (this._tag.type = null);
              else if (!this.addError('Missing or invalid tag name')) return !1;
            }
          return !0;
        }),
        (b.prototype.parseDescription = function () {
          var i = a(d, o, this._last).trim();
          return i && (/^-\s+/.test(i) && (i = i.substring(2)), (this._tag.description = i)), !0;
        }),
        (b.prototype.parseCaption = function () {
          var i = a(d, o, this._last).trim(),
            l = '<caption>',
            h = '</caption>',
            R = i.indexOf(l),
            v = i.indexOf(h);
          return (
            R >= 0 && v >= 0
              ? ((this._tag.caption = i.substring(R + l.length, v).trim()),
                (this._tag.description = i.substring(v + h.length).trim()))
              : (this._tag.description = i),
            !0
          );
        }),
        (b.prototype.parseKind = function () {
          var i, l;
          return (
            (l = {
              class: !0,
              constant: !0,
              event: !0,
              external: !0,
              file: !0,
              function: !0,
              member: !0,
              mixin: !0,
              module: !0,
              namespace: !0,
              typedef: !0,
            }),
            (i = a(d, o, this._last).trim()),
            (this._tag.kind = i),
            !(!F(l, i) && !this.addError("Invalid kind name '%0'", i))
          );
        }),
        (b.prototype.parseAccess = function () {
          var i;
          return (
            (i = a(d, o, this._last).trim()),
            (this._tag.access = i),
            !(
              i !== 'private' &&
              i !== 'protected' &&
              i !== 'public' &&
              !this.addError("Invalid access name '%0'", i)
            )
          );
        }),
        (b.prototype.parseThis = function () {
          var i = a(d, o, this._last).trim();
          if (i && i.charAt(0) === '{') {
            var l = this.parseType();
            return (l && this._tag.type.type === 'NameExpression') ||
              this._tag.type.type === 'UnionType'
              ? ((this._tag.name = this._tag.type.name), !0)
              : this.addError('Invalid name for this');
          } else return this.parseNamePath();
        }),
        (b.prototype.parseVariation = function () {
          var i, l;
          return (
            (l = a(d, o, this._last).trim()),
            (i = parseFloat(l, 10)),
            (this._tag.variation = i),
            !(isNaN(i) && !this.addError("Invalid variation '%0'", l))
          );
        }),
        (b.prototype.ensureEnd = function () {
          var A = a(d, o, this._last).trim();
          return !(A && !this.addError("Unknown content '%0'", A));
        }),
        (b.prototype.epilogue = function () {
          var i;
          return (
            (i = this._tag.description),
            !(
              c(this._title) &&
              !this._tag.type &&
              i &&
              i.charAt(0) === '[' &&
              ((this._tag.type = this._extra.name),
              this._tag.name || (this._tag.name = void 0),
              !K && !this.addError('Missing or invalid tag name'))
            )
          );
        }),
        (P = {
          access: ['parseAccess'],
          alias: ['parseNamePath', 'ensureEnd'],
          augments: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          constructor: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          class: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          extends: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          example: ['parseCaption'],
          deprecated: ['parseDescription'],
          global: ['ensureEnd'],
          inner: ['ensureEnd'],
          instance: ['ensureEnd'],
          kind: ['parseKind'],
          mixes: ['parseNamePath', 'ensureEnd'],
          mixin: ['parseNamePathOptional', 'ensureEnd'],
          member: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          method: ['parseNamePathOptional', 'ensureEnd'],
          module: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          func: ['parseNamePathOptional', 'ensureEnd'],
          function: ['parseNamePathOptional', 'ensureEnd'],
          var: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          name: ['parseNamePath', 'ensureEnd'],
          namespace: ['parseType', 'parseNamePathOptional', 'ensureEnd'],
          private: ['parseType', 'parseDescription'],
          protected: ['parseType', 'parseDescription'],
          public: ['parseType', 'parseDescription'],
          readonly: ['ensureEnd'],
          requires: ['parseNamePath', 'ensureEnd'],
          since: ['parseDescription'],
          static: ['ensureEnd'],
          summary: ['parseDescription'],
          this: ['parseThis', 'ensureEnd'],
          todo: ['parseDescription'],
          typedef: ['parseType', 'parseNamePathOptional'],
          variation: ['parseVariation'],
          version: ['parseDescription'],
        }),
        (b.prototype.parse = function () {
          var i, l, h, R;
          if (!this._title && !this.addError('Missing or invalid title')) return null;
          for (
            this._last = z(this._title),
              this._options.range &&
                (this._tag.range = [
                  this._first,
                  d.slice(0, this._last).replace(/\s*$/, '').length,
                ].map(N)),
              F(P, this._title)
                ? (h = P[this._title])
                : (h = ['parseType', 'parseName', 'parseDescription', 'epilogue']),
              i = 0,
              l = h.length;
            i < l;
            ++i
          )
            if (((R = h[i]), !this[R]())) return null;
          return this._tag;
        });
      function r(A) {
        var i, l, h;
        if (!Au()) return null;
        for (i = iu(), l = new b(A, i), h = l.parse(); o < l._last; ) S();
        return h;
      }
      function t(A) {
        var i = '',
          l,
          h;
        for (h = !0; o < U && ((l = d.charCodeAt(o)), !(h && l === 64)); )
          n.code.isLineTerminator(l) ? (h = !0) : h && !n.code.isWhiteSpace(l) && (h = !1),
            (i += S());
        return A ? i : i.trim();
      }
      function B(A, i) {
        var l = [],
          h,
          R,
          v,
          O,
          $;
        if (
          (i === void 0 && (i = {}),
          typeof i.unwrap == 'boolean' && i.unwrap ? (d = k(A)) : (d = A),
          (q = A),
          i.tags)
        )
          if (Array.isArray(i.tags))
            for (v = {}, O = 0, $ = i.tags.length; O < $; O++)
              typeof i.tags[O] == 'string'
                ? (v[i.tags[O]] = !0)
                : D.throwError('Invalid "tags" parameter: ' + i.tags);
          else D.throwError('Invalid "tags" parameter: ' + i.tags);
        for (
          U = d.length,
            o = 0,
            M = 0,
            eu = i.recoverable,
            K = i.sloppy,
            ru = i.strict,
            R = t(i.preserveWhitespace);
          (h = r(i)), !!h;

        )
          (!v || v.hasOwnProperty(h.title)) && l.push(h);
        return { description: R, tags: l };
      }
      C.parse = B;
    })((s = {})),
      (e.version = D.VERSION),
      (e.parse = s.parse),
      (e.parseType = u.parseType),
      (e.parseParamType = u.parseParamType),
      (e.unwrapComment = k),
      (e.Syntax = f(u.Syntax)),
      (e.Error = D.DoctrineError),
      (e.type = {
        Syntax: e.Syntax,
        parseType: u.parseType,
        parseParamType: u.parseParamType,
        stringify: u.stringify,
      });
  })();
})(cu);
const ie = lu(cu),
  { combineParameters: Ae } = __STORYBOOK_MODULE_PREVIEW_API__;
var se = e => {
    switch (e.type) {
      case 'function':
        return { name: 'function' };
      case 'object':
        let u = {};
        return (
          e.signature.properties.forEach(D => {
            u[D.key] = nu(D.value);
          }),
          { name: 'object', value: u }
        );
      default:
        throw new Error(`Unknown: ${e}`);
    }
  },
  nu = e => {
    let { name: u, raw: D } = e,
      s = {};
    switch ((typeof D < 'u' && (s.raw = D), e.name)) {
      case 'string':
      case 'number':
      case 'symbol':
      case 'boolean':
        return { ...s, name: u };
      case 'Array':
        return { ...s, name: 'array', value: e.elements.map(nu) };
      case 'signature':
        return { ...s, ...se(e) };
      case 'union':
      case 'intersection':
        return { ...s, name: u, value: e.elements.map(nu) };
      default:
        return { ...s, name: 'other', value: u };
    }
  },
  Fe = e => e.name === 'literal',
  Ce = e => e.value.replace(/['|"]/g, ''),
  Ee = e => {
    switch (e.type) {
      case 'function':
        return { name: 'function' };
      case 'object':
        let u = {};
        return (
          e.signature.properties.forEach(D => {
            u[D.key] = Z(D.value);
          }),
          { name: 'object', value: u }
        );
      default:
        throw new Error(`Unknown: ${e}`);
    }
  },
  Z = e => {
    let { name: u, raw: D } = e,
      s = {};
    switch ((typeof D < 'u' && (s.raw = D), e.name)) {
      case 'literal':
        return { ...s, name: 'other', value: e.value };
      case 'string':
      case 'number':
      case 'symbol':
      case 'boolean':
        return { ...s, name: u };
      case 'Array':
        return { ...s, name: 'array', value: e.elements.map(Z) };
      case 'signature':
        return { ...s, ...Ee(e) };
      case 'union':
        return e.elements.every(Fe)
          ? { ...s, name: 'enum', value: e.elements.map(Ce) }
          : { ...s, name: u, value: e.elements.map(Z) };
      case 'intersection':
        return { ...s, name: u, value: e.elements.map(Z) };
      default:
        return { ...s, name: 'other', value: u };
    }
  },
  du = /^['"]|['"]$/g,
  oe = e => e.replace(du, ''),
  le = e => du.test(e),
  ce = /^\(.*\) => /,
  Y = e => {
    let { name: u, raw: D, computed: s, value: n } = e,
      F = {};
    switch ((typeof D < 'u' && (F.raw = D), u)) {
      case 'enum': {
        let f = s
          ? n
          : n.map(g => {
              let y = oe(g.value);
              return le(g.value) || Number.isNaN(Number(y)) ? y : Number(y);
            });
        return { ...F, name: u, value: f };
      }
      case 'string':
      case 'number':
      case 'symbol':
        return { ...F, name: u };
      case 'func':
        return { ...F, name: 'function' };
      case 'bool':
      case 'boolean':
        return { ...F, name: 'boolean' };
      case 'arrayOf':
      case 'array':
        return { ...F, name: 'array', value: n && Y(n) };
      case 'object':
        return { ...F, name: u };
      case 'objectOf':
        return { ...F, name: u, value: Y(n) };
      case 'shape':
      case 'exact':
        let a = Vu(n, f => Y(f));
        return { ...F, name: 'object', value: a };
      case 'union':
        return { ...F, name: 'union', value: n.map(f => Y(f)) };
      case 'instanceOf':
      case 'element':
      case 'elementType':
      default: {
        if ((u == null ? void 0 : u.indexOf('|')) > 0)
          try {
            let y = u.split('|').map(I => JSON.parse(I));
            return { ...F, name: 'enum', value: y };
          } catch {}
        let f = n ? `${u}(${n})` : u,
          g = ce.test(u) ? 'function' : 'other';
        return { ...F, name: g, value: f };
      }
    }
  },
  Fu = e => {
    let { type: u, tsType: D, flowType: s } = e;
    return u != null ? Y(u) : D != null ? nu(D) : s != null ? Z(s) : null;
  },
  Be = (e => (
    (e.JAVASCRIPT = 'JavaScript'),
    (e.FLOW = 'Flow'),
    (e.TYPESCRIPT = 'TypeScript'),
    (e.UNKNOWN = 'Unknown'),
    e
  ))(Be || {}),
  pe = ['null', 'undefined'];
function Cu(e) {
  return pe.some(u => u === e);
}
var fe = e => {
  if (!e) return '';
  if (typeof e == 'string') return e;
  throw new Error(`Description: expected string, got: ${JSON.stringify(e)}`);
};
function mu(e) {
  return !!e.__docgenInfo;
}
function he(e) {
  return e != null && Object.keys(e).length > 0;
}
function de(e, u) {
  return mu(e) ? e.__docgenInfo[u] : null;
}
function me(e) {
  return mu(e) && fe(e.__docgenInfo.description);
}
function ye(e) {
  return e != null && e.includes('@');
}
function xe(e, u) {
  let D;
  try {
    D = ie.parse(e, { tags: u, sloppy: !0 });
  } catch (s) {
    throw (console.error(s), new Error('Cannot parse JSDoc tags.'));
  }
  return D;
}
var ge = { tags: ['param', 'arg', 'argument', 'returns', 'ignore', 'deprecated'] },
  Te = (e, u = ge) => {
    if (!ye(e)) return { includesJsDoc: !1, ignore: !1 };
    let D = xe(e, u.tags),
      s = ve(D);
    return s.ignore
      ? { includesJsDoc: !0, ignore: !0 }
      : { includesJsDoc: !0, ignore: !1, description: D.description, extractedTags: s };
  };
function ve(e) {
  let u = { params: null, deprecated: null, returns: null, ignore: !1 };
  for (let D = 0; D < e.tags.length; D += 1) {
    let s = e.tags[D];
    if (s.title === 'ignore') {
      u.ignore = !0;
      break;
    } else
      switch (s.title) {
        case 'param':
        case 'arg':
        case 'argument': {
          let n = Se(s);
          n != null && (u.params == null && (u.params = []), u.params.push(n));
          break;
        }
        case 'deprecated': {
          let n = Ne(s);
          n != null && (u.deprecated = n);
          break;
        }
        case 'returns': {
          let n = we(s);
          n != null && (u.returns = n);
          break;
        }
      }
  }
  return u;
}
function Se(e) {
  let u = e.name;
  return u != null && u !== 'null-null'
    ? {
        name: e.name,
        type: e.type,
        description: e.description,
        getPrettyName: () =>
          u.includes('null') ? u.replace('-null', '').replace('.null', '') : e.name,
        getTypeName: () => (e.type != null ? Q(e.type) : null),
      }
    : null;
}
function Ne(e) {
  return e.title != null ? e.description : null;
}
function we(e) {
  return e.type != null
    ? { type: e.type, description: e.description, getTypeName: () => Q(e.type) }
    : null;
}
function Q(e) {
  return e.type === 'NameExpression'
    ? e.name
    : e.type === 'RecordType'
    ? `({${e.fields
        .map(u => {
          if (u.value != null) {
            let D = Q(u.value);
            return `${u.key}: ${D}`;
          }
          return u.key;
        })
        .join(', ')}})`
    : e.type === 'UnionType'
    ? `(${e.elements.map(Q).join('|')})`
    : e.type === 'ArrayType'
    ? '[]'
    : e.type === 'TypeApplication' && e.expression != null && e.expression.name === 'Array'
    ? `${Q(e.applications[0])}[]`
    : e.type === 'NullableType' || e.type === 'NonNullableType' || e.type === 'OptionalType'
    ? Q(e.expression)
    : e.type === 'AllLiteral'
    ? 'any'
    : null;
}
function yu(e) {
  return e.length > 90;
}
function be(e) {
  return e.length > 50;
}
function w(e, u) {
  return e === u ? { summary: e } : { summary: e, detail: u };
}
function xu({ name: e, value: u, elements: D, raw: s }) {
  return u ?? (D != null ? D.map(xu).join(' | ') : s ?? e);
}
function Re({ name: e, raw: u, elements: D }) {
  return D != null ? w(D.map(xu).join(' | ')) : u != null ? w(u.replace(/^\|\s*/, '')) : w(e);
}
function Oe({ type: e, raw: u }) {
  return u != null ? w(u) : w(e);
}
function _e({ type: e, raw: u }) {
  return u != null ? (yu(u) ? w(e, u) : w(u)) : w(e);
}
function Pe(e) {
  let { type: u } = e;
  return u === 'object' ? _e(e) : Oe(e);
}
function Ie({ name: e, raw: u }) {
  return u != null ? (yu(u) ? w(e, u) : w(u)) : w(e);
}
function Le(e) {
  if (e == null) return null;
  switch (e.name) {
    case 'union':
      return Re(e);
    case 'signature':
      return Pe(e);
    default:
      return Ie(e);
  }
}
function ke(e, u) {
  if (e != null) {
    let { value: D } = e;
    if (!Cu(D)) return be(D) ? w(u.name, D) : w(D);
  }
  return null;
}
var Me = (e, u) => {
  let { flowType: D, description: s, required: n, defaultValue: F } = u;
  return { name: e, type: Le(D), required: n, description: s, defaultValue: ke(F, D) };
};
function Ue({ tsType: e, required: u }) {
  return e == null ? null : w(u ? e.name : e.name.replace(' | undefined', ''));
}
function We({ defaultValue: e }) {
  if (e != null) {
    let { value: u } = e;
    if (!Cu(u)) return w(u);
  }
  return null;
}
var Ve = (e, u) => {
  let { description: D, required: s } = u;
  return { name: e, type: Ue(u), required: s, description: D, defaultValue: We(u) };
};
function je(e) {
  return e != null ? w(e.name) : null;
}
function $e(e) {
  let { computed: u, func: D } = e;
  return typeof u > 'u' && typeof D > 'u';
}
function Ke(e) {
  return e
    ? e.name === 'string'
      ? !0
      : e.name === 'enum'
      ? Array.isArray(e.value) &&
        e.value.every(
          ({ value: u }) => typeof u == 'string' && u[0] === '"' && u[u.length - 1] === '"',
        )
      : !1
    : !1;
}
function Ge(e, u) {
  if (e != null) {
    let { value: D } = e;
    if (!Cu(D)) return $e(e) && Ke(u) ? w(JSON.stringify(D)) : w(D);
  }
  return null;
}
function gu(e, u, D) {
  let { description: s, required: n, defaultValue: F } = D;
  return { name: e, type: je(u), required: n, description: s, defaultValue: Ge(F, u) };
}
function au(e, u) {
  var D;
  if (u.includesJsDoc) {
    let { description: s, extractedTags: n } = u;
    s != null && (e.description = u.description);
    let F = {
      ...n,
      params:
        (D = n == null ? void 0 : n.params) == null
          ? void 0
          : D.map(a => ({ name: a.getPrettyName(), description: a.description })),
    };
    Object.values(F).filter(Boolean).length > 0 && (e.jsDocTags = F);
  }
  return e;
}
var Je = (e, u, D) => {
    let s = gu(e, u.type, u);
    return (s.sbType = Fu(u)), au(s, D);
  },
  Qe = (e, u, D) => {
    let s = Ve(e, u);
    return (s.sbType = Fu(u)), au(s, D);
  },
  qe = (e, u, D) => {
    let s = Me(e, u);
    return (s.sbType = Fu(u)), au(s, D);
  },
  ze = (e, u, D) => {
    let s = gu(e, { name: 'unknown' }, u);
    return au(s, D);
  },
  Tu = e => {
    switch (e) {
      case 'JavaScript':
        return Je;
      case 'TypeScript':
        return Qe;
      case 'Flow':
        return qe;
      default:
        return ze;
    }
  },
  vu = e =>
    e.type != null
      ? 'JavaScript'
      : e.flowType != null
      ? 'Flow'
      : e.tsType != null
      ? 'TypeScript'
      : 'Unknown',
  He = e => {
    let u = vu(e[0]),
      D = Tu(u);
    return e.map(s => {
      var F;
      let n = s;
      return (
        (F = s.type) != null &&
          F.elements &&
          (n = { ...s, type: { ...s.type, value: s.type.elements } }),
        Su(n.name, n, u, D)
      );
    });
  },
  Ye = e => {
    let u = Object.keys(e),
      D = vu(e[u[0]]),
      s = Tu(D);
    return u
      .map(n => {
        let F = e[n];
        return F != null ? Su(n, F, D, s) : null;
      })
      .filter(Boolean);
  },
  A0 = (e, u) => {
    let D = de(e, u);
    return he(D) ? (Array.isArray(D) ? He(D) : Ye(D)) : [];
  };
function Su(e, u, D, s) {
  let n = Te(u.description);
  return n.includesJsDoc && n.ignore
    ? null
    : { propDef: s(e, u, n), jsDocTags: n.extractedTags, docgenInfo: u, typeSystem: D };
}
function s0(e) {
  return e != null && me(e);
}
var F0 = e => {
    let {
        component: u,
        argTypes: D,
        parameters: { docs: s = {} },
      } = e,
      { extractArgTypes: n } = s,
      F = n && u ? n(u) : {};
    return F ? Ae(F, D) : D;
  },
  Xe = 'storybook/docs',
  C0 = `${Xe}/snippet-rendered`,
  Ze = (e => ((e.AUTO = 'auto'), (e.CODE = 'code'), (e.DYNAMIC = 'dynamic'), e))(Ze || {}),
  u0 = _u,
  e0 = u0(Object.getPrototypeOf, Object),
  E0 = e0;
export {
  C0 as S,
  Be as T,
  E0 as _,
  X as a,
  s0 as b,
  w as c,
  Ze as d,
  F0 as e,
  A0 as f,
  de as g,
  mu as h,
  be as i,
  yu as j,
  a0 as r,
  fe as s,
  i0 as u,
};
//# sourceMappingURL=_getPrototype-f17fb99d.js.map
