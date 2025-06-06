---
uid: reportagent-deletefavorite
title: ReportAgent.DeleteFavorite event method
description: Scripting events called on the DeleteFavorite method on the ReportAgent service agent.
so.generated: true
keywords: netserver scripting
so.topic: reference
so.envir: onsite
---
# ReportAgent.DeleteFavorite

Scripting events called on the <see cref='M:IReportAgent.DeleteFavorite'>DeleteFavorite</see> method on the <see cref='IReportAgent'>IReportAgent</see>  service agent.

## BeforeDeleteFavorite
```cs
    static void BeforeDeleteFavorite(
       Int32  reportEntityId,
       ref object  eventState
      );
```
Executes before the service method is invoked.
It can store some state in the *eventState* parameter, that is passed to the **After** and **AfterAsync** methods in this service call.
Event state is not preserved between different service calls. It is set to null at the start of each service call.
## AfterDeleteFavorite
```cs
    static void AfterDeleteFavorite(
       Int32  reportEntityId,
       ref object  eventState
      );
```
Executes after the service method has been invoked. The service waits for this method to complete before returning the result to the caller.
This service call has no return value, so there is no **returnValue** parameter
Any state you set in the **Before** method is passed in through the *eventState* parameter.
## AfterDeleteFavoriteAsync
```cs
    static void AfterDeleteFavoriteAsync(
       Int32  reportEntityId,
       ref object  eventState
      );
```
Executes after the service method is invoked, without waiting for the call to return.
The service call is not blocked waiting for this method to complete.
Any state you set in the **Before** method is passed in through the *eventState* parameter.

