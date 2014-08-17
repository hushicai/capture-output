capture-output
==============

将shell命令的输出截成图片。

## 基本用法

```bash
npm install capture-output
capture-output "ls -l"
```

## 注意事项

在windows中，有些命令可能无法执行，比如`dir`，这个命令在windows上并不是真正可执行的命令，它是依附在`cmd`中的，
如果要捕获`dir`命令的输出，则需要这样：

```bash
capture-output "cmd /c dir"
```

windows下其他命令类似。
