# Hacks for migrating Markdown content

* Turn off Learn lint

## Frontmatter

* Add layout prop (if using regex do this before commenting out H1)

## Admonitions

Regex search for

```html
> \[!(NOTE|TIP|CAUTION|WARNING)\]\s*(?:\r?\n)(?:(?:> (.*))(?:\r?\n|$))+
```

Replace with

```html
:::note{.\L$1}
$2
:::

```

(yes blank line below ending triple colon)

Need a custom run to deal with indented notes!

## Comment out H1

Regex search for

```html
^# (.*)
```

Exclude content code samples, then replace with

```html
<!-- #1 -->
```

## Headings

Change self-closing anchor tags to `<a id="SLUG"></a>`

(NA. Solved in issue 1285)

## Media

* Move images to central folder
* Update paths accordingly
