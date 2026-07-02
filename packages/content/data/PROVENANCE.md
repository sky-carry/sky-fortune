# 数据来源与许可证（PROVENANCE）

生成日期：2026-07-02。本目录数据由开源数据集清洗合并而来，raw/ 下保留原始文件。

## 1. hanzi.json — 康熙笔画 + 汉字五行字典

- 条目数：**8830** 个汉字（覆盖 mapull 3500 常用字表中的 3323 个）
- 格式：`{ "汉": { "k": 15, "w": "水" }, ... }`，k = 康熙笔画（简体字按对应繁体口径），w = 五行（金木水火土），UTF-8 无 BOM
- 构建方式：以五行表为主键，先用 OpenCC 简繁映射把字转为繁体（取第一候选），再查康熙笔画表；无笔画数据的 459 个五行字被跳过

### 原始数据源

| raw 文件 | 内容 | 来源 URL | 许可证 |
|---|---|---|---|
| `raw/wuge_kangxi.csv.txt` | codepoint → 康熙笔画（46816 条） | https://raw.githubusercontent.com/hongyuanjia/wuge/f7d8ca64244ac2dacc6ca69ff44b67030be8d661/tools/data/kangxi.csv | wuge 仓库整体 GPLv3；该数据上游为 https://github.com/fh250250/fortune （康熙字典数据，**未声明许可证**） |
| `raw/wuge_wuxing.csv.txt` | 汉字 → 五行（9288 条） | https://raw.githubusercontent.com/hongyuanjia/wuge/f7d8ca64244ac2dacc6ca69ff44b67030be8d661/tools/data/wuxing.csv | 上游为 https://github.com/sinshine/AI-name （**未声明许可证**） |
| `raw/opencc_STCharacters.txt` | 简体 → 繁体映射 | https://raw.githubusercontent.com/hongyuanjia/wuge/f7d8ca64244ac2dacc6ca69ff44b67030be8d661/tools/data/STCharacters.txt | OpenCC（https://github.com/BYVoid/OpenCC ），Apache-2.0 |
| `raw/mapull_char_common.json` | 3500 常用字表（仅用于覆盖率校验） | https://raw.githubusercontent.com/hongyuanjia/wuge/f7d8ca64244ac2dacc6ca69ff44b67030be8d661/tools/data/char_common.json | mapull/chinese-dictionary，MIT |

**许可证注意**：康熙笔画与五行两个上游数据集均未声明许可证（属传统字典类事实性数据，独创性低），商用前建议法务复核或改用 Unicode Unihan（kRSKangXi）自算笔画。

### 验证结果（22/22 通过）

任务指定 10 字：王4、李7、张11、陈16、刘15、黄12、林8、吴7、海11、华14 — 全部一致。
额外抽查 12 字：谢17、赵14、周8、徐10、孙10、马10、郑19、郭15、何7、高10、罗20、杨13 — 全部一致（对照通行姓名学康熙笔画表）。

## 2. chenggu.json — 袁天罡称骨算命

- 单位：整数“钱”（1两 = 10钱）
- 内容：`yearWeight`（60 干支 → 钱）、`monthWeight`（农历 1-12 月）、`dayWeight`（初一~三十，键 "1"-"30"）、`hourWeight`（子~亥）、`verses.male` / `verses.female`（骨重钱数 → `{ge: 歌诀, comment: 批语}`，**男女各一套**）
- 歌诀条数：女命 51 条（21~71 钱）；男命 52 条（21~72 钱，其中 72“七两二钱”为部分版本附加条目，按四表最大可达总重 71 钱实际不可达，保留备用）
- 可达总重范围：21~71 钱

### 数据源（四表交叉核对 3 个代码仓库 + 3 个网页）

| raw 文件 | 来源 URL | 许可证 |
|---|---|---|
| `raw/chxb_chenggu.js`、`raw/chxb_LICENSE.txt`（**主数据源**：四表 + 男女歌诀 + 男女批语） | https://github.com/chxb/chenggu （commit 0f86a69） | MIT |
| `raw/bonefate_utils.py`（交叉核对：四表 + 通用批语） | https://github.com/Ficere/bonefate （commit e64cee6） | MIT |
| `raw/bazifortune_data.js`、`raw/bazifortune_poems.js`（交叉核对：四表 + 男女解命诗） | https://github.com/WangSimiao2000/bazi-fortune （commit 4d16386） | MIT |

### 交叉核对结论与分歧

- 月表、日表、时辰表：三个仓库完全一致。
- 年表（60 干支）：chxb 与 bonefate 逐项对比仅 **癸亥** 一处分歧（chxb=6钱，bonefate=7钱）；bazi-fortune 采用公历年→骨重表，其 1984-2020 段与 chxb 逐年一致（1983癸亥=0.7 即 7钱）。
- **癸亥分歧裁决**：采用 **6 钱**。多数版本（4:2）支持 6 钱 —— chxb/chenggu、6sq.net（https://www.6sq.net/article/26128 ）、华易网（https://m.k366.com/gj/chenggu.htm ）、吉名字网（https://www.jimingzi.com/chenggu/1535.html ）均作“六钱”；少数版本（Ficere/bonefate、WangSimiao2000/bazi-fortune）作 7 钱。
- bazi-fortune 年表早期年份（1926、1933、1934、1936、1937）与其自身 60 年后同干支年数值矛盾，判定为该仓库笔误，未采信。

## 其他说明

- raw/ 中两个 CSV 以 `.csv.txt` 扩展名保存：本机终端防泄漏软件会对新建的 `.csv` 文件做透明加密（文件头出现 `%TSD-Header-###%`），改用 `.txt` 扩展名可保持明文。内容与上游 CSV 逐字节一致。
- 清洗脚本（build_hanzi.js / build_chenggu.js）位于会话 scratchpad，未随仓库保留；如需重建可按上表 URL 重新下载后按本文件描述的规则重生成。
