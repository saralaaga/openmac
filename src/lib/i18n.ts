/**
 * Site-wide UI strings for the en/zh locales. Content (apps, categories)
 * carries its own zh fields; this covers chrome only.
 */
export type Locale = 'en' | 'zh';

const en = {
	nav: { apps: 'Apps', reviews: 'Reviews', search: 'Search', about: 'About' },
	home: {
		title: 'Open Source Mac Apps — Free & Hands-On Tested | OpenMac',
		description:
			'A curated, human-tested directory of free & open source Mac apps — alternatives to paid software, with metadata refreshed daily.',
		h1: 'Free & Open Source Mac Apps',
		intro:
			'OpenMac is a curated directory of free and open source apps for macOS — every app hand-tested, every listing a genuine alternative to paid software. No paywalls, no affiliate rankings: just tools we use, with stars, releases and downloads refreshed daily.',
		freshness: (n: number) => `${n} apps · metadata refreshed daily`,
		usp: [
			{ title: 'Free & open source', body: 'Apache/MIT license, no subscriptions.' },
			{ title: 'Tested by humans', body: 'Real daily use, not changelog summaries.' },
			{ title: 'Always fresh', body: 'Stars, releases and downloads refresh daily.' },
		],
		categories: 'Categories',
		allApps: 'all apps →',
		mostStarred: 'Most starred',
		latestReviews: 'Latest reviews',
		allReviews: 'all reviews →',
	},
	apps: { title: 'Apps', count: (n: number) => `${n} curated open source apps and counting.`, empty: 'nothing here yet — this directory is being curated.' },
	category: { nothing: 'nothing here yet — this category is being curated.' },
	platform: { nothing: 'nothing here yet — this platform section is being curated.' },
	app: {
		about: 'About',
		review: 'Review',
		reviewEmpty: "not reviewed yet — it's on the list.",
		readReview: 'read the hands-on review →',
		starHistory: 'Star history',
		metadata: 'Metadata',
		related: 'Related',
		license: 'License',
		stars: 'Stars',
		lastRelease: 'Last release',
		platforms: 'Platforms',
		synced: 'Synced',
	},
	install: {
		title: 'Install',
		copy: 'copy',
		copied: 'copied ✓',
		download: 'Download',
		appStore: 'App Store →',
		testFlight: 'Join TestFlight →',
		forYou: 'for your system',
	},
	reviews: { title: 'Reviews', intro: 'hands-on, opinionated, and based on daily use — not changelogs.', empty: 'first reviews are being written.' },
	langSwitch: '中文',
};

const zh: typeof en = {
	nav: { apps: '应用', reviews: '评测', search: '搜索', about: '关于' },
	home: {
		title: '开源 Mac 应用精选 — 免费 · 实测评测 | OpenMac',
		description: '精选人工实测的免费开源 Mac 应用目录——付费软件的替代品，元数据每日刷新。',
		h1: '免费开源 Mac 应用',
		intro:
			'OpenMac 是一个精选目录，收录 macOS 上免费、开源的应用——每一款都经人工实测，每一个条目都是付费软件的真正替代品。没有付费墙，没有竞价排名：只有我们在用的工具，星标、发布与下载信息每日自动刷新。',
		freshness: (n: number) => `${n} 个应用 · 元数据每日刷新`,
		usp: [
			{ title: '免费开源', body: 'Apache、MIT 许可，无需订阅。' },
			{ title: '人工实测', body: '基于日常真实使用，不是更新日志摘要。' },
			{ title: '数据常新', body: '星标、发布与下载信息每日自动刷新。' },
		],
		categories: '分类',
		allApps: '全部应用 →',
		mostStarred: '最多星标',
		latestReviews: '最新评测',
		allReviews: '全部评测 →',
	},
	apps: { title: '应用', count: (n: number) => `${n} 个精选开源应用，持续扩充。`, empty: '这里还空着——目录正在筹备中。' },
	category: { nothing: '这里还空着——该分类正在筹备中。' },
	platform: { nothing: '这里还空着——该平台板块正在筹备中。' },
	app: {
		about: '介绍',
		review: '评测',
		reviewEmpty: '尚未评测——已列入计划。',
		readReview: '阅读实测评测 →',
		starHistory: 'Star 历史',
		metadata: '元数据',
		related: '相关应用',
		license: '许可证',
		stars: '星标',
		lastRelease: '最近发布',
		platforms: '平台',
		synced: '同步于',
	},
	install: {
		title: '安装',
		copy: '复制',
		copied: '已复制 ✓',
		download: '下载',
		appStore: 'App Store →',
		testFlight: '加入 TestFlight →',
		forYou: '匹配你的系统',
	},
	reviews: { title: '评测', intro: '基于日常使用的实评——不是更新日志。', empty: '首批评测正在撰写中。' },
	langSwitch: 'English',
};

export const strings: Record<Locale, typeof en> = { en, zh };

export function t(locale: Locale) {
	return strings[locale] ?? strings.en;
}

export function otherLocale(locale: Locale): Locale {
	return locale === 'zh' ? 'en' : 'zh';
}

/** zh URL for an en path (and vice versa). */
export function localeSwap(locale: Locale, pathname: string): string {
	const p = pathname.replace(/^\/zh/, '') || '/';
	return locale === 'zh' ? `/zh${p === '/' ? '/' : p}` : p;
}
