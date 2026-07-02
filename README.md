# Sky Fortune

命理/玄学产品 monorepo：A 出海站（付费测算+订阅）+ B 境内传统文化工具站（黄历+起名），共享一套命理引擎与内容库。

- 立项调研：[docs/research/](docs/research/00-调研总结与功能规划.md)
- 总体方案与技术选型：[docs/plan/01-总体方案与技术选型.md](docs/plan/01-总体方案与技术选型.md)

## 结构

```
packages/engine   # 命理引擎（纯函数，已完成）：
                  #   bazi/    八字排盘、十神、五行旺衰、喜用神、大运
                  #   naming/  五格三才、81 数理、姓名综合打分（含八字契合）
                  #   hehun/   八字合婚（六合三合冲害刑、天干五合、纳音、用神互补）
                  #   almanac/ 老黄历宜忌、冲煞、建除、黄黑道、择日反查
                  #   misc/    称骨、抽签框架（数据接 content 层）
                  #   naming/suggest 起名吉利笔画组合（分级放宽）
                  # 规划中：紫微(iztro)、流年运势
packages/content  # 数据资产与数据感知层（已完成）：
                  #   hanzi.json    8830 字康熙笔画+五行字典（22 字抽样验证，来源见 PROVENANCE.md）
                  #   chenggu.json  称骨四表+男女骨歌（三源交叉核对）
                  #   name-chars    人工起名字池 + suggestNames 起名推荐
apps/cn           # B 境内站（已上线四个页面，Next.js）：
                  #   /            今日黄历    /huangli/[date] 任意日期黄历
                  #   /zeri        传统择日    /qiming 宝宝起名   /ceming 姓名文化解析
apps/global       # A 出海站（规划中）
```

## 开发

```bash
pnpm install
pnpm test                                  # 全部测试
pnpm --filter @sky-fortune/engine demo     # 排盘示例输出
```

## 引擎口径（已冻结，见 docs/plan/01 §四）

年柱立春换界、月柱节气换界（精确到交节时刻）；晚子时日柱算当天（sect 2）；真太阳时默认关闭；五行旺衰用加权打分（月令 ×1.5，同党占比 ≥50% 判偏强）。改动口径必须先改回归测试。
