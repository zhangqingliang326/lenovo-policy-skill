// ============================================================
// 联想教育套装政策助手 - 天禧Claw Skill
// 功能：查询活动政策、产品信息、补贴金额等
// 数据来源：本地 data.json（由维护人员定期更新）
// ============================================================

const fs = require('fs');
const path = require('path');

let allData = null;

function loadData() {
    if (allData) return allData;
    const dataPath = path.join(__dirname, 'data.json');
    allData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return allData;
}

function search(keyword) {
    const data = loadData();
    const kw = keyword.toLowerCase();
    return data.filter(f => {
        const text = [
            f['\u6587\u672c'], f['\u4e00\u53e5\u8bdd\u8bf4\u6e05'], f['\u6307\u5b9a\u4ea7\u54c1'],
            f['\u987e\u5ba2\u80fd\u5f97\u5230\u4ec0\u4e48'], f['\u64cd\u4f5c\u6b65\u9aa4'],
            f['\u6ce8\u610f\u4e8b\u9879'], f['\u6d3b\u52a8\u65f6\u95f4'],
            f['\u6211\u80fd\u8d5a\u591a\u5c11'], f['\u5173\u8054\u6d3b\u52a8'], f['\u9002\u7528\u4eba\u7fa4']
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(kw);
    });
}

function fmtActivity(f) {
    const lines = [];
    lines.push('## ' + (f['\u6587\u672c'] || ''));
    lines.push(f['\u72b6\u6001'] || '');
    lines.push(f['\u6d3b\u52a8\u65f6\u95f4'] || '');
    lines.push('');
    lines.push('\u4e00\u53e5\u8bdd\u8bf4\u6e05\uff1a' + (f['\u4e00\u53e5\u8bdd\u8bf4\u6e05'] || ''));
    if (f['\u987e\u5ba2\u80fd\u5f97\u5230\u4ec0\u4e48']) lines.push('\n\u987e\u5ba2\u80fd\u5f97\u5230\uff1a\n' + f['\u987e\u5ba2\u80fd\u5f97\u5230\u4ec0\u4e48']);
    if (f['\u6211\u80fd\u8d5a\u591a\u5c11']) lines.push('\n\u95e8\u5e97\u80fd\u8d5a\uff1a\n' + f['\u6211\u80fd\u8d5a\u591a\u5c11']);
    if (f['\u64cd\u4f5c\u6b65\u9aa4']) lines.push('\n\u64cd\u4f5c\u6b65\u9aa4\uff1a\n' + f['\u64cd\u4f5c\u6b65\u9aa4']);
    if (f['\u6307\u5b9a\u4ea7\u54c1']) lines.push('\n\u6307\u5b9a\u4ea7\u54c1\uff1a\n' + f['\u6307\u5b9a\u4ea7\u54c1']);
    if (f['\u9002\u7528\u4eba\u7fa4']) lines.push('\n\u9002\u7528\u4eba\u7fa4\uff1a' + f['\u9002\u7528\u4eba\u7fa4']);
    if (f['\u6ce8\u610f\u4e8b\u9879']) lines.push('\n\u6ce8\u610f\u4e8b\u9879\uff1a\n' + f['\u6ce8\u610f\u4e8b\u9879']);
    if (f['\u5173\u8054\u6d3b\u52a8']) lines.push('\n\u5173\u8054\u6d3b\u52a8\uff1a' + f['\u5173\u8054\u6d3b\u52a8']);
    return lines.join('\n');
}

function fmtProduct(f) {
    const lines = [];
    lines.push('## ' + (f['\u6587\u672c'] || ''));
    lines.push(f['\u6d3b\u52a8\u65f6\u95f4'] || '');
    if (f['\u4e00\u53e5\u8bdd\u8bf4\u6e05']) lines.push('\u5957\u88c5\u53c2\u4e0e\uff1a' + f['\u4e00\u53e5\u8bdd\u8bf4\u6e05']);
    if (f['\u987e\u5ba2\u80fd\u5f97\u5230\u4ec0\u4e48']) lines.push(f['\u987e\u5ba2\u80fd\u5f97\u5230\u4ec0\u4e48']);
    if (f['\u6211\u80fd\u8d5a\u591a\u5c11']) lines.push(f['\u6211\u80fd\u8d5a\u591a\u5c11']);
    return lines.join('\n');
}

async function activate(context) {
    context.registerTool({
        name: 'query_policy',
        description: '\u67e5\u8be2\u8054\u60f3\u6559\u80b2\u5957\u88c5\u653f\u7b56\u3001\u6d3b\u52a8\u4fe1\u606f\u3001\u4ea7\u54c1\u8865\u8d34\u7b49\u3002\u5f53\u7528\u6237\u8be2\u95ee\u8054\u60f3\u653f\u7b56\u3001\u6d3b\u52a8\u3001\u8865\u8d34\u3001\u5957\u88c5\u3001\u6652\u5355\u3001PO\u52a0\u78c5\u3001\u4ea7\u54c1\u4ef7\u683c\u7b49\u95ee\u9898\u65f6\u8c03\u7528\u3002',
        parameters: {
            type: 'object',
            properties: {
                keyword: { type: 'string', description: '\u641c\u7d22\u5173\u952e\u8bcd\uff0c\u5982\u4ea7\u54c1\u578b\u53f7(Y9000P)\u3001\u6d3b\u52a8\u540d\u79f0(\u4e09\u4ef6\u5957)\u3001\u653f\u7b56\u7c7b\u578b(\u6559\u80b2\u8865\u8d34)\u7b49' }
            },
            required: ['keyword']
        },
        handler: async (params) => {
            const results = search(params.keyword);
            if (results.length === 0) return '\u672a\u627e\u5230\u4e0e"' + params.keyword + '"\u76f8\u5173\u7684\u653f\u7b56\u4fe1\u606f\u3002\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u5173\u952e\u8bcd\u3002';
            const acts = results.filter(r => r['\u72b6\u6001'] !== '\ud83d\udcbb \u4ea7\u54c1\u901f\u67e5');
            const prods = results.filter(r => r['\u72b6\u6001'] === '\ud83d\udcbb \u4ea7\u54c1\u901f\u67e5');
            let output = '';
            if (acts.length > 0) {
                output += '# \u76f8\u5173\u6d3b\u52a8\u653f\u7b56\uff08' + acts.length + '\u6761\uff09\n\n';
                output += acts.map(fmtActivity).join('\n\n---\n\n');
            }
            if (prods.length > 0) {
                output += '\n\n# \u76f8\u5173\u4ea7\u54c1\u4fe1\u606f\uff08' + Math.min(prods.length, 15) + '/' + prods.length + '\u6761\uff09\n\n';
                output += prods.slice(0, 15).map(fmtProduct).join('\n\n');
                if (prods.length > 15) output += '\n\n...\u8fd8\u6709' + (prods.length - 15) + '\u6761\uff0c\u8bf7\u7f29\u5c0f\u641c\u7d22\u8303\u56f4\u3002';
            }
            return output;
        }
    });

    context.registerTool({
        name: 'list_activities',
        description: '\u5217\u51fa\u5f53\u524d\u6240\u6709\u8fdb\u884c\u4e2d\u7684\u6d3b\u52a8\u653f\u7b56\u6982\u89c8\u3002\u5f53\u7528\u6237\u95ee"\u73b0\u5728\u6709\u4ec0\u4e48\u6d3b\u52a8"\u3001"\u5f53\u524d\u653f\u7b56"\u7b49\u5bbd\u6cdb\u95ee\u9898\u65f6\u8c03\u7528\u3002',
        parameters: { type: 'object', properties: {} },
        handler: async () => {
            const data = loadData();
            const acts = data.filter(r => r['\u72b6\u6001'] && r['\u72b6\u6001'] !== '\ud83d\udcbb \u4ea7\u54c1\u901f\u67e5');
            let output = '# \u5f53\u524d\u6d3b\u52a8\u653f\u7b56\u4e00\u89c8\n\n';
            for (const a of acts) {
                output += '- **' + (a['\u6587\u672c'] || '') + '** ' + (a['\u72b6\u6001'] || '') + '\n';
                output += '  ' + (a['\u6d3b\u52a8\u65f6\u95f4'] || '') + ' | ' + (a['\u4e00\u53e5\u8bdd\u8bf4\u6e05'] || '') + '\n\n';
            }
            return output;
        }
    });
}

module.exports = { activate };
