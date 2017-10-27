
---

title: mysql引擎
date: 2017-07-17
tag: [php, database]

---

> MyISAM锁表，InnoDB锁行；MyISAM不支持事务，InnoDB支持。

MySQL的[Introduction to InnoDB](https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html)介绍了InnoBD的一些特点：

Key advantages of InnoDB include:

- Its DML operations follow the ACID model, with transactions featuring commit, rollback, and crash-recovery capabilities to protect user data. See Section 14.2, “InnoDB and the ACID Model” for more information.

- Row-level locking and Oracle-style consistent reads increase multi-user concurrency and performance. See Section 14.5, “InnoDB Locking and Transaction Model” for more information.

- InnoDB tables arrange your data on disk to optimize queries based on primary keys. Each InnoDB table has a primary key index called the clustered index that organizes the data to minimize I/O for primary key lookups. See Section 14.8.2.1, “Clustered and Secondary Indexes” for more information.

- To maintain data integrity, InnoDB supports FOREIGN KEY constraints. With foreign keys, inserts, updates, and deletes are checked to ensure they do not result in inconsistencies across different tables. See Section 14.8.1.6, “InnoDB and FOREIGN KEY Constraints” for more information. 

DML(Data Manipulation Language)数据操纵语言。

ACID是指在可靠数据库管理系统（DBMS）中，事务(transaction)所应该具有的四个特性：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）。

翻译过来就是：

- InnoDB的DML操作支持ACID事务模型中的提交、回滚、崩溃恢复
- 行锁和类似Oracle的并行读取提升了多用户操作性能。
- InnoDB表依靠主键整理磁盘中的数据以改善查询。每一张InnoDB表都有一个叫聚合索引的主键用来组织数据以最小化主键的查询I/O。
- 为了保证数据完整和同步，InnoDB提供了外键约束。通过外键，跨表的数据插入、更新、删除可以保证一致

未完待续
MyISAM特点
mysql优化