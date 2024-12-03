# git config

```

git config --global user.name "Your Name"

git config --global user.email "email@example.com"

git config --list

```

#### Secure Shell (SSH)

```
ssh-keygen -t rsa -C  "email"

```

将生成的.pub文件添加入github->setting->SSH and GPG keys

```
// 验证

ssh -T git@github.com

```

# git script

|script|function|
|---|---|
|`git restore --staged .`|取消暂存所有文件|
|`git restore .`|取消暂存所有文件且撤销修改|
|`git rm -r --cached .`|清除git缓存|
|`git remote add upstream url`|另一个远程仓库|
|`git remote -v`|远程仓库信息|
|`git push repoName`|提交到当前远程仓库|

# .gitignore

|use|function|
|--|--|
|/filename|根目录下filename文件夹及所有文件|
|filename/|filename文件夹下所有文件|