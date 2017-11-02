
cur_time=$(date "+%Y/%m/%d %H:%M:%S")

if [ $1 = "test" ]; then
    hexo g >/dev/null; hexo d >/dev/null; hexo s;
elif [ $1 = "comment" ]; then
    if [ -z "$2" ]; then
        $2 = $cur_time;
    fi
    git add -A; git commit -a -m "$2"; git push;
elif [ $1 = "push" ]; then
    git add -A; git commit -a -m "$cur_time"; git push;
elif [ $1 = "COMMENT" ]; then
    if [ -z "$2" ]; then
        $2 = $cur_time;
    fi
    hexo g >/dev/null; hexo d >/dev/null; git add -A; git commit -a -m "$2"; git push;
elif [ $1 = "PUSH" ]; then
    hexo g >/dev/null; hexo d >/dev/null; git add -A; git commit -a -m "$cur_time"; git push;
fi
