---
layout: default
title: Koyomiya Docs
---

# Koyomiya Docs

### 最新記事

<ul>
  {% for post in site.posts limit:10 %}
    <li>
      {{ post.date | date: "%Y-%m-%d" }} <a href="{{ post.url | relative_url }}">{{ post.title }}</a>    </li>
  {% endfor %}
</ul>
[もっとみる](allposts)

### タグで検索

<div>
  {% for page in site.html_pages %}
    {% if page.tag %}
      <a href="{{ site.url }}{{ site.baseurl }}/tags/{{ page.tag }}.html">{{ page.tag }}</a>
    {% endif %}
  {% endfor %}
</div>
