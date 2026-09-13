import a from './a.js';
import b from './b.js';
import c from './c.js';

/**
 * 研究档案索引。
 *
 * 拆成三个文件只是为了让每个文件保持可读——A 是二十世纪初的欧洲与风格派，
 * B 是战后与东亚，C 是消费时代与数字时代。合并后仍然按藏品 id 查询。
 */
export const DOSSIER = { ...a, ...b, ...c };

export const dossierFor = (id) => DOSSIER[id] || null;

export default DOSSIER;
