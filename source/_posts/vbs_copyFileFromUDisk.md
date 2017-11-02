---
title: VBS探索U盘
date: 2017/06/27
tag: [VBS]
---

如果存在多个可移动磁盘，通过该脚本可以迅速拷贝目标文件，并分析磁盘结构。

目录：
<!-- MarkdownTOC -->

- [参数说明](#%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)
- [源代码](#%E6%BA%90%E4%BB%A3%E7%A0%81)

<!-- /MarkdownTOC -->

<!-- more -->

<a name="%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E"></a>
## 参数说明

```
    ListLB：         列出大于该值的文件，0表示列出所有

    ListDepthToStop：列表深度，0表示列出所有

    RunFileCopy：    是否运行拷贝模块

    CopyFrom：       进行拷贝搜索的根目录

    CopyPattern：    拷贝搜索的正则表达式

    CopyLB：         拷贝下界，0表示无下界

    CopyUB：         拷贝上界，0表示无上界

    InfoTo：         U盘信息保存目录

    DriveInfoTo：    U盘信息保存文件

    DriveListTo：    U盘文件信息保存文件
```

<a name="%E6%BA%90%E4%BB%A3%E7%A0%81"></a>
## 源代码

```vbs
ListLB              = 0
ListDepthToStop     = 0
RunFileCopy         = True
CopyFrom            = ""
CopyPattern         = ""
CopyLB              = 0
CopyUB              = 1024*1024*3
InfoTo              = ""
DriveInfoTo         = ""
DriveListTo         = ""

set FSO         = CreateObject("Scripting.FileSystemObject")
set Drives      = FSO.Drives
set RE          = New RegExp
CurDrive        = FSO.GetDriveName(FSO.GetAbsolutePathName("."))
RE.Pattern      = CopyPattern

For Each Drive In Drives
    If  Drive.DriveType = 1 _
    AND Drive.Path <> CurDrive Then
        Randomize
        SavingFolder    = FSO.BuildPath(CurDrive\InfoTo\Drive.VolumeName_Int(Rnd()*100))
        Call MakeFolder(SavingFolder)

        set F_DriveInfo = FSO.OpenTextFile(FSO.BuildPath(SavingFolder, DriveInfoTo), 2, True, -1)
        set F_DriveList = FSO.OpenTextFile(FSO.BuildPath(SavingFolder, DriveListTo), 2, True, -1)
        Call ListDrive(Drive.Path)
        Call ListFolder(Drive.RootFolder.Path, 1)
        F_DriveInfo.Close
        F_DriveList.Close

        IF CopyFrom = "" Then CopyFrom = Drive.RootFolder.Path
        IF RunFileCopy = True AND FSO.FolderExists(CopyFrom) Then _
            Call FileCopy(CopyFrom, SavingFolder)
    End If
Next

Function ListDrive (drive_path__)
    set drive__     = FSO.GetDrive(drive_path__)
    F_DriveInfo.WriteLine("Date:" & " " & Date())
    F_DriveInfo.WriteLine("VolumeName:" & " " & drive__.VolumeName)
    F_DriveInfo.WriteLine("FileSystem:" & " " & drive__.FileSystem)
    F_DriveInfo.WriteLine("TotalSize:" & " " & drive__.TotalSize/1024/1024)
    F_DriveInfo.WriteLine("FreeSpace:" & " " & drive__.FreeSpace/1024/1024)
End Function

Function ListFolder(cur_folder__, cur_depth__)
    F_DriveList.WriteLine(Space((cur_depth__-1)*2) & "+ " & FSO.GetBaseName(cur_folder__))
    For Each cur_file__ In FSO.GetFolder(cur_folder__).Files
        If (ListLB = 0 OR cur_file__.Size > ListLB) Then _
            F_DriveList.WriteLine(Space(cur_depth__*2) & cur_file__.Name)
    Next
    For Each sub_folder__ In FSO.GetFolder(cur_folder__).SubFolders
        IF (DepthToStop = 0 OR cur_depth__ < DepthToStop) Then _
            Call ListFolder(sub_folder__, cur_depth__ + 1)
    Next
End Function

Function FileCopy(src_folder__, sav_folder__)
    For Each cur_file__ In FSO.GetFolder(src_folder__).Files
        IF  (CopyUB = 0 OR cur_file__.Size < CopyUB) _
        AND (CopyLB = 0 OR cur_file__.Size > CopyLB) _
        AND (RE.Test(cur_file__.Name) = True) Then
            IF Not FSO.FolderExists(sav_folder__) Then Call MakeFolder(sav_folder__)
            FSO.CopyFile cur_file__.Path, FSO.BuildPath(sav_folder__, cur_file__.Name)
        End If
    Next
    For Each sub_folder__ In FSO.GetFolder(src_folder__).SubFolders
        Call FileCopy(sub_folder__,FSO.BuildPath(sav_folder__, FSO.GetBaseName(sub_folder__)))
    Next
End Function

Function MakeFolder(tar_path__)
    If Not FSO.FolderExists(FSO.GetParentFolderName(tar_path__)) Then _
        Call MakeFolder(FSO.GetParentFolderName(tar_path__))
    If Not FSO.FolderExists(tar_path__) Then _
        FSO.CreateFolder(tar_path__)
End Function
```