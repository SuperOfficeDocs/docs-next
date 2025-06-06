---
uid: emailagent-syncemailaccounts
title: EMailAgent.SyncEmailAccounts event method
description: Scripting events called on the SyncEmailAccounts method on the EMailAgent service agent.
so.generated: true
keywords: netserver scripting
so.topic: reference
so.envir: onsite
---
# EMailAgent.SyncEmailAccounts

Scripting events called on the <see cref='M:IEMailAgent.SyncEmailAccounts'>SyncEmailAccounts</see> method on the <see cref='IEMailAgent'>IEMailAgent</see>  service agent.

## BeforeSyncEmailAccounts
```cs
    static void BeforeSyncEmailAccounts(
       SyncUserAccount[]  syncUserAccounts,
       ref object  eventState
      );
```
Executes before the service method is invoked.
It can store some state in the *eventState* parameter, that is passed to the **After** and **AfterAsync** methods in this service call.
Event state is not preserved between different service calls. It is set to null at the start of each service call.
## AfterSyncEmailAccounts
```cs
    static void AfterSyncEmailAccounts(
       SyncUserAccount[]  syncUserAccounts,
       ref object  eventState
      );
```
Executes after the service method has been invoked. The service waits for this method to complete before returning the result to the caller.
This service call has no return value, so there is no **returnValue** parameter
Any state you set in the **Before** method is passed in through the *eventState* parameter.
## AfterSyncEmailAccountsAsync
```cs
    static void AfterSyncEmailAccountsAsync(
       SyncUserAccount[]  syncUserAccounts,
       ref object  eventState
      );
```
Executes after the service method is invoked, without waiting for the call to return.
The service call is not blocked waiting for this method to complete.
Any state you set in the **Before** method is passed in through the *eventState* parameter.

