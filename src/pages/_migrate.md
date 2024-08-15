# Hacks for migrating Markdown content

* Turn off Learn lint

## Frontmatter

* Add layout prop (if using regex do this before commenting out H1)

## Admonitions

Regex search for

```
> \[!(NOTE|TIP|CAUTION|WARNING)\]\s*(?:\r?\n)(?:(?:> (.*))(?:\r?\n|$))+
```

Replace with

```
:::note{.\L$1}
$2
:::

```

(yes blank line below ending triple colon)

Need a custom run to deal with indented notes!

## Comment out H1

Regex search for

```
^# (.*)
```

Exclude content code samples, then replace with

```
<!-- #1 -->
```

## Media

* Move images to central folder
* Update paths accordingly