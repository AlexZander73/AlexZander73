# Blog Repo Template (Jekyll + GitHub Pages)

Minimal Jekyll blog designed for GitHub Pages, with RSS/Atom feed at `/feed.xml`.

## Quick Start

1. Create a new repo and copy the contents of this folder.
2. Enable GitHub Pages on the `main` branch.
3. Push a post to `_posts/`.

## Local Preview (Optional)

GitHub Pages builds Jekyll automatically. If you want to preview locally:

```bash
bundle install
bundle exec jekyll serve
```

## Create a Post

Add a markdown file to `_posts/`:

```
YYYY-MM-DD-title.md
```

Example front matter:

```
---
layout: post
title: "Post Title"
date: 2026-02-16
tags: [travel, notes]
hero: /assets/img/hero.jpg
---
```

## Feed (Integration Contract)

The feed is generated at `/feed.xml` and includes:
- `<title>`
- `<link>`
- Date field (`published` or `updated`)
- Optional `<summary>` / `<description>`

Set the main site `BLOG_FEED_URL` to: `https://YOURBLOG.github.io/feed.xml`

## Tags Page

`/tags.html` lists tags and posts per tag.

## Future Automation (Optional)

Once `/feed.xml` exists, you can connect RSS → social scheduling using tools like Buffer + Zapier or IFTTT.
